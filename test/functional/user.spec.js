/* eslint-disable */
const { test, trait } = use('Test/Suite')('User');

trait('Test/ApiClient');
trait('Auth/Client');

const User = use('App/Models/User');
const moment = require('moment');
const faker = require('faker');

const { createUserWithParams, getDBRowsNumber } = require('../utils');



test('POST user.store (200). User can be created', async ({ client }) => {
  const response = await createUserWithParams(client);

  response.assertStatus(200);
});

test('POST user.store (200). 1 user is being created', async ({
  client,
  assert,
}) => {
  const usersAmountBefore = await getDBRowsNumber(User);

  await createUserWithParams(client);

  const usersAmountAfter = await getDBRowsNumber(User);

  assert.equal(usersAmountBefore + 1, usersAmountAfter);
});

test('POST user.store (422) empty password', async ({ client }) => {
  const response = await createUserWithParams(client, { password: null });

  response.assertStatus(422);
}).timeout(0);

test('POST user.store (422) empty email', async ({ client }) => {
  const response = await createUserWithParams(client, { email: null });

  response.assertStatus(422);
});

test('POST user.store (422) age < 21', async ({ client }) => {
  const response = await createUserWithParams(client, {
    birthday: moment().toISOString(),
  });

  response.assertStatus(422);
});

test('PUT users.update (200) User updates own info', async ({
  client,
  assert,
}) => {
  const { body } = await createUserWithParams(client);

  const newEmail = faker.internet.email();

  const response = await client
    .put(`/users/${body.id}`)
    .send({ ...body, email: newEmail })
    .loginVia(body, 'jwt')
    .end();

  response.assertStatus(200);

  assert.equal(response.body.email, newEmail);
});

test("PUT users.update (403) User updates some one's info", async ({
  client,
}) => {
  const { body } = await createUserWithParams(client);

  const newEmail = faker.internet.email();

  const response = await client
    .put('/users/77777') /* some ones user id */
    .send({ ...body, email: newEmail })
    .loginVia(body, 'jwt')
    .end();

  response.assertStatus(403);
});
