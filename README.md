# JWT WECHICKEN BACKEND V2

## 1. Technical Stack

- Node.js
- TypeScript
- express
- prisma
- mysql

## 2. Project Layer

```
/src
├── app.ts // express 미들웨어 설정 파일
├── controllers // request 핸들러 레이어
│   ├── BatchController.ts
│   ├── BlogController.ts
│   ├── UserController.ts
│   └── index.ts
├── errors // error 핸들링 관련 레이어
│   ├── errorGenerator.ts
│   ├── errorWrapper.ts
│   ├── generalErrorHandler.ts
│   └── index.ts
├── middlewares // 컨트롤러 로직에 닿기 전에 처리해야 할 로직
│   ├── index.ts
│   └── validateToken.ts
├── prisma // 앱 내에서 사용 될 데이터 모델이 담겨있는 레이어
│   ├── index.ts
│   └── schema.prisma
├── routes // 라우팅 레이어
│   ├── BatchRouter.ts
│   ├── BlogRouter.ts
│   ├── UserRouter.ts
│   └── index.ts
├── server.ts // 서버 엔트리 파일
├── services // Prisma를 이용한 데이터베이스 접근 레이어
│   ├── BatchService.ts
│   ├── BlogService.ts
│   ├── UserService.ts
│   └── index.ts
└── utils
    └── index.ts
```

## 3. Database Schema

- 리팩토링 한 ERD 링크와 비밀번호 [Wechicken Notion Private Page](https://www.notion.so/private-013625a5b8c44967886e3a6c7636de77)에 기록 되어 있음
- jwt_refactor.sql 파일을 mysql 명령어로 실행하면 스키마 생성 됨
- 먼저 API 구현하고 추후에 기존에 있던 데이터를 이전하는 스크립트 코드 작성해야 함

## 4. RESTful API Endpoints

기획 단계이기 때문에, 같이 설계 해 나가면 좋을 것 같습니다.
기본적인 룰은, **데이터 자원** 에 기반한 설계 입니다.

### Reference

- [Toast MeetUp, RESTful API](https://meetup.toast.com/posts/92)
- [REST API Design Tutorial](https://restfulapi.net/rest-api-design-tutorial-with-example/)

### users

```
- GET, /users/:userId (userID를 가진 유저의 정보를 응답)
- GET, /users/:userId/followers (userId를 가진 유저를 follow 하는 다수의 유저 정보를 응답)
- GET, /users/:userId/followees (userId를 가진 유저가 follow 하는 다수의 유저 정보를 응답)
- GET, /users/:userId/blogs (userId를 가진 유저의 다수의 블로그 포스트를 응답)
- POST, /users/login/google (구글 로그인 처리)
- POST, /users/:userId/follow (로그인 token 에 담긴 유저가 userId를 follow 할 수 있도록 함)
```

### blogs

```
- GET, /blogs
    (BlogService 에서 핵심 서비스 로직 구현하기, query string 으로 filter 기능 pagination 처리하기
    main 페이지, search, 기수 페이지에서 모두 이 엔드포인트를 호출,
    query string 으로 로직을 처리할 수 있도록 Service 함수를 추상화 시키고 필요한 helper 함수들을 utils 단에서 구현하기)
- POST, /blogs (포스트+ 버튼을 통해서 블로그 포스트 생성하는 기능)
- POST, /blogs/:blogId/likes (로그인 token 에 담긴 유저가 blogId를 좋아하는 기능)
- POST, /blogs/:blogId/bookmarks (로그인 token 에 담긴 유저가 blogId를 북마크 하는 기능)
- PUT, /blogs/:blogId (마이 페이지에서 포스트 수정하는 기능)
- DELETE, /blogs/:blogId (마이 페이지에서 포스트 삭제하는 기능)
```

### batches

```
- GET, /batches (User 토큰에서 기수 정보 꺼내와서 해당 기수의 정보를 응답)
- GET, /batches/blogs (User 토큰에서 기수 정보 꺼내와서 해당 기수 블로그 정보 응답)
- POST, /batches (기수 생성)
- PUT, /batches (기수 정보 변경, title, 벌금 정보 등..)
```

## 5. Prisma 설정

- [prisma official document](https://www.prisma.io/docs/concepts/overview/what-is-prisma/)

### Prerequisites

- node moudles 설치

```
$ npm install
```

- 데이터 베이스 마이그레이션

```
$ mysql -u 계정이름 -p 데이터베이스 이름 < jwt_refactor.sql

ex)
$ mysql -u root -p jwt_refactor < jwt_refactor.sql
```

### 1. 데이터베이스 URL

```shell
$ cp .env.example .env
```

.env 파일 안에서 다음과 같이 DATABASE URL 설정하기

```
DATABASE_URL_DEV = mysql://DB_USER:DB_USER_PASSWORD@127.0.0.1:3306/DB_NAME
```

- DB_USER: 데이터베이스에 접근 가능한 계정
- DB_USER_PASSWORD: 유저의 비밀번호
- DB_NAME: MySQL 서버에 생성한 데이터베이스 이름

### 2. npx prisma generate

- `prisma/shcema.prisma` 에 기반해 Prisma Client API(ORM API)를 생성하는 명령어

```shell
$ npx prisma generate
```

## 6. 개발 서버 실행

- `package.json` 안에 TypeScript -> JavaScript 로 컴파일 하고, 컴파일 된 파일을 nodemon 으로 실행시키는 스크립트 코드 작성되어 있음

```
$ npm run dev
```

명령어를 실행시키면 서버가 켜지고,
개발 단계에서 코드가 수정되면 자동으로 hot reloading 됨

## 7. Tests

```
/tests
├── config.ts
└── test.spec.ts
```

#### Supertest, Jest 를 이용한 API 테스트

- `config.ts`: 테스트 코드 내에서 공유 될 context 를 만드는 모듈
- `test.spec.ts`: 테스트 코드의 싱글 스레드(runInBand 옵션)와 순서를 보장하기 위해서 각각의 test 코드를 구현하고 import 해서 실행 시키는 모듈
- 테스트 코드에 대한 예가 tests 폴더 안에 코드로 구성되어 있음
- 기본적으로 여러 input 과 output 에 대해 테스트 하기 위해 `test.each` 함수를 이용 함
- `package.json` 에 ts-jest 를 사용하도록 스크립트 코드 작성 되어 있음

```
$ npm run test
```
