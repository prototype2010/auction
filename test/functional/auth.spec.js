const { test, trait } = use('Test/Suite')('Auth');

trait('Test/ApiClient');
trait('Auth/Client');
const Event = use('Event');
const User = use('App/Models/User');

const {
  createUserWithParams,
  getUserToken,
  getRecentEmail,
  getRecoveryTokenFromLastEmail,
} = require('../utils');

test('POST users.auth (200) User can receive token', async ({
  client,
  assert,
}) => {
  const password = 'XXXXXXXXXX';
  const createdUserResponse = await createUserWithParams(client,
    { password, repeatPassword: password });
  const { body: user } = createdUserResponse;

  const authAttempt = await client
    .post('/users/auth/login')
    .send({
      email: user.email,
      password,
    })
    .end();

  authAttempt.assertStatus(200);

  const { body } = authAttempt;
  const { token, type, refreshToken } = body;

  assert.containsAllKeys(body, ['token', 'type', 'refreshToken']);
  assert.exists(token);
  assert.exists(type);
  assert.exists(refreshToken);
});

test('POST users.auth (401) Wrong email', async ({ client }) => {
  const password = 'NAGIBATOR__777';

  await createUserWithParams(client, { password });

  const response = await client
    .post('/users/auth/login')
    .send({
      email: 'imWrongEmail@gmail.com',
      password,
    })
    .end();

  response.assertStatus(401);
});

test('POST users.auth (401) Wrong password', async ({ client }) => {
  const createdUser = await createUserWithParams(client, { password: 'NAGIBATOR__777' });

  const response = await client
    .post('/users/auth/login')
    .send({
      email: createdUser.body.email,
      password: 'WRONG_PASSWORD',
    })
    .end();

  response.assertStatus(401);
});

test('POST users.auth (200) Protected Data can be received', async ({ client }) => {
  const { body } = await createUserWithParams(client);

  const response = await client
    .get('lots')
    .loginVia(body, 'jwt')
    .end();

  response.assertStatus(200);
});

test("POST users.auth (401) Protected Data can't be received", async ({ client }) => {
  const userIdsArray = (await User.all()).rows.map(({ id }) => id);
  const notExistingUserId = Math.max(...userIdsArray) + 1;

  const response = await client
    .get('lots')
    .loginVia({ id: notExistingUserId }, 'jwt')
    .end();
  response.assertStatus(401);
});

test('POST users.auth.refresh (200) Token can be refreshed', async ({
  client,
  assert,
}) => {
  const userTokenInfo = await getUserToken(client);

  const { body: newTokenInfo } = await client
    .post('/users/auth/refresh')
    .header('refresh_token', userTokenInfo.body.refreshToken)
    .end();

  const { token, type, refreshToken } = newTokenInfo;

  assert.containsAllKeys(newTokenInfo, ['token', 'type', 'refreshToken']);
  assert.exists(token);
  assert.exists(type);
  assert.exists(refreshToken);
});

test("POST users.auth.refresh (401) Wrong Token can't be refreshed", async ({ client }) => {
  const response = await client
    .post('/users/auth/refresh')
    .header('refresh_token', 'wrong token')
    .end();

  response.assertStatus(401);
});

test("POST users.auth.refresh (401) Refresh token can't be used twice", async ({ client }) => {
  const { body } = await getUserToken(client);

  await client
    .post('/users/auth/refresh')
    .header('refresh_token', body.refreshToken)
    .end();

  const response = await client
    .post('/users/auth/refresh')
    .header('refresh_token', body.refreshToken)
    .end();

  response.assertStatus(401);
});

test('POST users.auth.refresh (200) New token is valid after refresh', async ({ client }) => {
  const userTokenInfo = await getUserToken(client);

  const { body: newTokenInfo } = await client
    .post('/users/auth/refresh')
    .header('refresh_token', userTokenInfo.body.refreshToken)
    .end();

  const { token, refreshToken } = newTokenInfo;

  const response = await client
    .get('lots')
    .header('Authorization', `bearer ${token}`)
    .header('refresh_token', refreshToken)
    .end();

  response.assertStatus(200);
});

test('POST users.auth.refresh (401) Old Token is invalid after refresh', async ({ client }) => {
  const userTokenInfo = await getUserToken(client);

  const { body: newTokenInfo } = await client
    .post('/users/auth/refresh')
    .header('refresh_token', userTokenInfo.body.refreshToken)
    .end();

  const { refreshToken } = newTokenInfo;

  const response = await client
    .get('lots')
    .header('Authorization', `bearer ${userTokenInfo.token}`)
    .header('refresh_token', refreshToken)
    .end();

  response.assertStatus(401);
});

test('POST users.auth.logout (200) user can logout successfully', async ({ client }) => {
  const { body } = await getUserToken(client);

  const { token, refreshToken } = body;

  const response = await client
    .post('/users/auth/logout')
    .header('Authorization', `bearer ${token}`)
    .header('refresh_token', refreshToken)
    .end();

  response.assertStatus(200);
});

test("POST users.auth.logout (401) Logged out user can't refresh token", async ({ client }) => {
  const { body } = await getUserToken(client);

  const { token, refreshToken } = body;

  await client
    .post('/users/auth/logout')
    .header('Authorization', `bearer ${token}`)
    .header('refresh_token', refreshToken)
    .end();

  const response = await client
    .post('/users/auth/refresh')
    .header('refresh_token', refreshToken)
    .end();

  response.assertStatus(401);
});

// / new
test('POST users.password-recovery (200) User can recover password', async ({ client }) => {
  const { body: user } = await createUserWithParams(client);

  const response = await client
    .post('/users/auth/password-recovery')
    .send({ email: user.email })
    .end();

  response.assertStatus(200);
});

test('Email sent to correct user', async ({ client, assert }) => {
  const { body: user } = await createUserWithParams(client);

  const response = await client
    .post('/users/auth/password-recovery')
    .send({ email: user.email })
    .end();

  const [recepientEmail] = (await getRecentEmail()).envelope.to;

  response.assertStatus(200);

  assert.equal(recepientEmail, user.email);
});

test('Event will be fired for correct user', async ({ client, assert }) => {
  Event.fake();

  const { body: user } = await createUserWithParams(client);

  await client
    .post('/users/auth/password-recovery')
    .send({ email: user.email })
    .end();

  const { data: userDataArray, event } = Event.recent();

  assert.equal(event, 'user::passwordLost');
  assert.equal(userDataArray[0].toJSON().email, user.email);

  Event.restore();
});


test('Email contains recovery url', async ({ client, assert }) => {
  const { body: user } = await createUserWithParams(client);
  const { email } = user;

  await client
    .post('/users/auth/password-recovery')
    .send({ email })
    .end();

  const { passwordRecoveryToken } = await User.findBy('email', email);

  const lastEmail = await getRecentEmail();

  assert.isTrue(
    lastEmail.message.html.includes(
      `users/auth/lost-password/${passwordRecoveryToken}`,
    ),
  );
});

test('Email recovery token matches', async ({ client, assert }) => {
  const { body: user } = await createUserWithParams(client);
  const { email } = user;

  await client
    .post('/users/auth/password-recovery')
    .send({ email })
    .end();

  const { passwordRecoveryToken } = await User.findBy('email', email);

  const recoveryToken = await getRecoveryTokenFromLastEmail();

  assert.equal(recoveryToken, passwordRecoveryToken);
});

test('GET password-recovery (200) Recovery code gives correct response', async ({
  client,
  assert,
}) => {
  const { body: user } = await createUserWithParams(client);
  const { email } = user;

  await client
    .post('/users/auth/password-recovery')
    .send({ email })
    .end();

  const passwordRecoveryToken = await getRecoveryTokenFromLastEmail();

  const password = 'im new password';

  const response = await client
    .post(`users/auth/password-recovery/${passwordRecoveryToken}`)
    .send({ email, password, repeatPassword: password })
    .end();

  response.assertStatus(200);
  assert.equal(response.body.message, 'Password changed successfully');
});

test('POST users/auth/login Correct event will be fired', async ({
  client,
  assert,
}) => {
  const { body: user } = await createUserWithParams(client);
  const { email } = user;

  await client
    .post('/users/auth/password-recovery')
    .send({ email })
    .end();

  const passwordRecoveryToken = await getRecoveryTokenFromLastEmail();

  Event.fake();

  const newPassword = 'newPassword$$$';

  await client
    .post(`users/auth/password-recovery/${passwordRecoveryToken}`)
    .send({
      email,
      password: newPassword,
      repeatPassword: newPassword,
    })
    .end();

  const { data: userDataArray, event } = Event.recent();

  assert.equal(event, 'user::passwordChanged');
  assert.equal(userDataArray[0].email, user.email);

  Event.restore();
}).timeout(0);

test('POST users/auth/password-recovery (200) Password after recovery works fine', async ({ client }) => {
  const { body: user } = await createUserWithParams(client);
  const { email } = user;

  await client
    .post('/users/auth/password-recovery')
    .send({ email })
    .end();

  const passwordRecoveryToken = await getRecoveryTokenFromLastEmail();

  const newPassword = 'im new password';

  await client
    .post(`users/auth/password-recovery/${passwordRecoveryToken}`)
    .send({
      email,
      password: newPassword,
      repeatPassword: newPassword,
    })
    .end();

  const response = await client
    .post('/users/auth/login')
    .send({
      email,
      password: newPassword,
    })
    .end();

  response.assertStatus(200);
}).timeout(0);

test('POST users/auth/password-recovery (404) Incorrect token returns error', async ({ client }) => {
  const { body: user } = await createUserWithParams(client);
  const { email } = user;

  await client
    .post('/users/auth/password-recovery')
    .send({ email })
    .end();

  const response = await client
    .get('users/auth/password-recovery/WRONG_TOKEN')
    .end();

  response.assertStatus(404);
});

test('POST users/auth/password-recovery (200) Protected data can be reached', async ({ client }) => {
  const { body: user } = await createUserWithParams(client);
  const { email } = user;

  await client
    .post('/users/auth/password-recovery')
    .send({ email })
    .end();


  const newPassword = 'im new password';

  const passwordRecoveryToken = await getRecoveryTokenFromLastEmail();

  await client
    .post(`users/auth/password-recovery/${passwordRecoveryToken}`)
    .send({ email, password: newPassword, repeatPassword: newPassword })
    .end();


  const response = await client
    .post('/users/auth/login')
    .send({
      email,
      password: newPassword,
    })
    .end();

  const { token } = response.body;

  const protectedRouteResponse = await client
    .get('lots')
    .header('Authorization', `bearer ${token}`)
    .end();

  protectedRouteResponse.assertStatus(200);
}).timeout(0);
