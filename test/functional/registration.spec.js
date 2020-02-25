const faker = require('faker');
const { test, trait } = use('Test/Suite')('User');


trait('Test/ApiClient');

test('Create new user', async ({ client }) => {

  const fakeUser = {
    email: faker.internet.email(),
    username: faker.internet.userName(),
    password: faker.internet.password(),
  };

  const response = await client.post('/users').send(fakeUser).end();

  response.assertStatus(200);
});

test('Get created user by ID', async ({ client }) => {

  const fakeUser = {
    email: faker.internet.email(),
    username: faker.internet.userName(),
    password: faker.internet.password(),
  };

  const createdUser = await client.post('/users').send(fakeUser).end();

  const user = JSON.parse(createdUser.text);

  const gotById = await client.get(`/users/${user.id}`).end();

  gotById.assertJSONSubset(user);
});

test('Created user can be updated', async ({ client }) => {

  const fakeUser = {
    email: faker.internet.email(),
    username: faker.internet.userName(),
    password: faker.internet.password(),
  };

  const createdUser = await client.post('/users').send(fakeUser).end();
  const createdUserInfo = JSON.parse(createdUser.text);
  const updateInfo = {
    email: faker.internet.email(),
    password: faker.internet.password(),
  };

  const updatedUser = await client.put(`/users/${createdUserInfo.id}`).send(updateInfo).end();

  updatedUser.assertJSONSubset({email: updateInfo.email});
});
