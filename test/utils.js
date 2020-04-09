/* eslint-disable */

const Mail = use('Mail');
const Factory = use('Factory');
const faker = require('faker');
const _ = require('lodash');

const createUser = async (overrideParams = {}) => {

  const user = await Factory.model('App/Models/User').make();

  _.merge(user,overrideParams)

  await user.save();

  return user;
}

const makeLot = async (overrideParams = {}) => {

  const lot = await Factory.model('App/Models/Lot').make();

  Object.assign(lot,overrideParams)

  return lot;
}

const createUserWithParams = async (client, overrideParams = {}) => {
  const fakeUser = await Factory.get('App/Models/User').make();

  const response = await client
    .post('/users')
    .send({ ...fakeUser, ...overrideParams })
    .end();

  return response;
};

const getDBRowsNumber = async (entity) => {
  const { rows } = await entity.all();
  return rows.length;
};

const getUserToken = async client => {
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
  await new Promise(res => setTimeout(res, 200));

  return Mail.recent();
};

const getPasswordFromLastEmail = async () => {
  const lastEmail = await getRecentEmail();

  const [, newPassword] = lastEmail.message.html.match(
    /New password : ([a-zA-Z0-9]*)/,
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
  getDBRowsNumber,
  createUserWithParams,
  getUserToken,
  getRecentEmail,
  getPasswordFromLastEmail,
  getRecoveryTokenFromLastEmail,
  createUser,
  makeLot,
};
