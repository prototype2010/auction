const Mail = use('Mail');
const Factory = use('Factory');
const faker = require('faker');

const createUserWithParams = async (client, overrideParams = {}) => {
  const fakeUser = await Factory.get('App/Models/User').make();

  const response = await client
    .post('/users')
    .send({ ...fakeUser, ...overrideParams })
    .end();

  return response;
};

const getUserToken = async (client) => {
  const password = faker.internet.password();

  const { body: user } = await createUserWithParams(client, { password });

  const response = await client
    .post('/users/auth/login')
    .send({
      email: user.email,
      password,
    })
    .end();

  return response;
};

const getRecentEmail = async () => {
  await new Promise((res) => setTimeout(res, 200));

  return Mail.recent();
};

const getPasswordFromLastEmail = async () => {
  const lastEmail = await getRecentEmail();

  const [, newPassword] = lastEmail.message.html.match(
    /New password : ([a-zA-Z0-9]*)/
  );

  return newPassword;
};

/* eslint-disable */
const getRecoveryTokenFromLastEmail = async () => {
  const lastEmail = await getRecentEmail();

  const [, recoveryToken] = lastEmail.message.html.match(
    /users\/auth\/lost-password\/([a-zA-Z0-9]*)/
  );

  return recoveryToken;
};

module.exports = {
  createUserWithParams,
  getUserToken,
  getRecentEmail,
  getPasswordFromLastEmail,
  getRecoveryTokenFromLastEmail,
};
