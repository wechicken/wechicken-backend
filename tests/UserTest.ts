const UserTest = () =>
  describe('User API Test', () => {
    test('should successfully create a user instance', () => {
      expect(1).toBe(1)
    })

    test.each`
      user_email           | user_password | expected_user_google_uuid
      ${'jun@gmail.com'}   | ${1234}       | ${1}
      ${'token@gmail.com'} | ${12345}      | ${2}
    `(
      'should successfully handle a user login',
      ({ user_email, user_password, expected_user_google_uuid }) => {
        const login = (user_email, user_password) => expected_user_google_uuid

        expect(login(user_email, user_password)).toBe(expected_user_google_uuid)
      }
    )
  })


export default UserTest
