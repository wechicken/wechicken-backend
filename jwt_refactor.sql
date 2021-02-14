CREATE TABLE batch_types
(
    `id`    INT            NOT NULL    AUTO_INCREMENT, 
    `name`  VARCHAR(45)    NOT NULL, 
    PRIMARY KEY (id)
);

ALTER TABLE batch_types
    ADD CONSTRAINT UC_name UNIQUE (name);

INSERT INTO batch_types (id, name)
VALUES 
    (1, "서울 부트캠프"),
    (2, "소셜클럽 웹"),
    (3, "소셜클럽 앱");

CREATE TABLE batches
(
    `id`              INT            NOT NULL    AUTO_INCREMENT, 
    `batch_type_id`   INT            NOT NULL, 
    `manager_id`      INT            NULL, 
    `nth`             INT            NOT NULL, 
    `title`           VARCHAR(45)    NULL, 
    `penalty`         INT            NULL, 
    `count`           INT            NULL,
    `is_page_opened`  BOOLEAN        NOT NULL, 
    `created_at`      DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP, 
    `updated_at`      DATETIME       NULL ON UPDATE CURRENT_TIMESTAMP, 
    `deleted_at`      DATETIME       NULL, 
    PRIMARY KEY (id)
);

ALTER TABLE batches
    ADD CONSTRAINT UC_nth UNIQUE(nth);

ALTER TABLE batches
    ADD CONSTRAINT FK_batches_batch_type_id_batch_types_id FOREIGN KEY (batch_type_id)
        REFERENCES batch_types (id) ON DELETE RESTRICT ON UPDATE RESTRICT;


CREATE TABLE blog_types
(
    `id`    INT            NOT NULL    AUTO_INCREMENT, 
    `name`  VARCHAR(45)    NOT NULL, 
    PRIMARY KEY (id)
);

ALTER TABLE blog_types
    ADD CONSTRAINT UC_name UNIQUE (name);

INSERT INTO blog_types (id, name)
VALUES 
    (1, "velog"),
    (2, "medium"),
    (3, "tistory"),
    (4, "github");

-- batch_types Table Create SQL
CREATE TABLE users
(
    `id`               INT              NOT NULL    AUTO_INCREMENT, 
    `blog_type_id`     INT              NULL, 
    `batch_id`         INT              NOT NULL, 
    `gmail_id`         VARCHAR(255)     NOT NULL, 
    `gmail`            VARCHAR(255)     NOT NULL, 
    `blog_address`     VARCHAR(255)    NOT NULL, 
    `name`             VARCHAR(45)      NOT NULL, 
    `thumbnail`        VARCHAR(1000)    NULL, 
    `is_admin`         BOOLEAN          NOT NULL, 
    `is_group_joined`  BOOLEAN          NOT NULL, 
    `created_at`       DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP, 
    `updated_at`       DATETIME         NULL ON UPDATE CURRENT_TIMESTAMP, 
    `deleted_at`       DATETIME         NULL, 
    PRIMARY KEY (id)
);

ALTER TABLE users
    ADD CONSTRAINT FK_users_blog_type_id_blog_types_id FOREIGN KEY (blog_type_id)
        REFERENCES blog_types (id) ON DELETE RESTRICT ON UPDATE RESTRICT;

ALTER TABLE users
    ADD CONSTRAINT FK_users_batch_id_batches_id FOREIGN KEY (batch_id)
        REFERENCES batches (id) ON DELETE RESTRICT ON UPDATE RESTRICT;

ALTER TABLE users
    ADD CONSTRAINT UC_gmail_id UNIQUE (gmail_id);

ALTER TABLE users
    ADD CONSTRAINT UC_gmail UNIQUE (gmail);


CREATE TABLE blogs
(
    `id`            INT              NOT NULL    AUTO_INCREMENT, 
    `user_id`       INT              NOT NULL, 
    `title`         VARCHAR(255)     NOT NULL, 
    `subtitle`      VARCHAR(255)     NULL, 
    `link`          VARCHAR(1000)    NOT NULL, 
    `thumbnail`     VARCHAR(1000)    NULL, 
    `written_date`  DATETIME         NOT NULL, 
    `created_at`    DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP, 
    `updated_at`    DATETIME         NULL ON UPDATE CURRENT_TIMESTAMP, 
    `deleted_at`    DATETIME         NULL, 
    PRIMARY KEY (id)
);

ALTER TABLE blogs
    ADD CONSTRAINT FK_blogs_user_id_users_id FOREIGN KEY (user_id)
        REFERENCES users (id) ON DELETE RESTRICT ON UPDATE RESTRICT;


CREATE TABLE tags
(
    `id`       INT             NOT NULL    AUTO_INCREMENT, 
    `blog_id`  INT             NOT NULL, 
    `user_id`  INT             NOT NULL, 
    `name`     VARCHAR(100)    NOT NULL, 
    PRIMARY KEY (id)
);

ALTER TABLE tags
    ADD CONSTRAINT FK_tags_user_id_users_id FOREIGN KEY (user_id)
        REFERENCES users (id) ON DELETE RESTRICT ON UPDATE RESTRICT;

ALTER TABLE tags
    ADD CONSTRAINT FK_tags_blog_id_blogs_id FOREIGN KEY (blog_id)
        REFERENCES blogs (id) ON DELETE RESTRICT ON UPDATE RESTRICT;

ALTER TABLE tags 
    ADD CONSTRAINT UC_name UNIQUE (name);

CREATE TABLE bookmarks
(
    `id`       INT        NOT NULL    AUTO_INCREMENT, 
    `blog_id`  INT        NOT NULL, 
    `user_id`  INT        NOT NULL, 
    `status`   BOOLEAN    NOT NULL, 
    PRIMARY KEY (id)
);

ALTER TABLE bookmarks
    ADD CONSTRAINT FK_bookmarks_blog_id_blogs_id FOREIGN KEY (blog_id)
        REFERENCES blogs (id) ON DELETE RESTRICT ON UPDATE RESTRICT;

ALTER TABLE bookmarks
    ADD CONSTRAINT FK_bookmarks_user_id_users_id FOREIGN KEY (user_id)
        REFERENCES users (id) ON DELETE RESTRICT ON UPDATE RESTRICT;


CREATE TABLE likes
(
    `id`       INT        NOT NULL    AUTO_INCREMENT, 
    `blog_id`  INT        NOT NULL, 
    `user_id`  INT        NOT NULL, 
    `status`   BOOLEAN    NOT NULL, 
    PRIMARY KEY (id)
);

ALTER TABLE likes
    ADD CONSTRAINT FK_likes_blog_id_blogs_id FOREIGN KEY (blog_id)
        REFERENCES blogs (id) ON DELETE RESTRICT ON UPDATE RESTRICT;

ALTER TABLE likes
    ADD CONSTRAINT FK_likes_user_id_users_id FOREIGN KEY (user_id)
        REFERENCES users (id) ON DELETE RESTRICT ON UPDATE RESTRICT;


CREATE TABLE follows
(
    `id`           INT    NOT NULL    AUTO_INCREMENT, 
    `follower_id`  INT    NOT NULL, 
    `followee_id`  INT    NOT NULL, 
    PRIMARY KEY (id)
);

ALTER TABLE follows
    ADD CONSTRAINT FK_follows_follower_id_users_id FOREIGN KEY (follower_id)
        REFERENCES users (id) ON DELETE RESTRICT ON UPDATE RESTRICT;

ALTER TABLE follows
    ADD CONSTRAINT FK_follows_followee_id_users_id FOREIGN KEY (followee_id)
        REFERENCES users (id) ON DELETE RESTRICT ON UPDATE RESTRICT;


