const { test, trait } = use('Test/Suite')('User');
const Factory = use('Factory');
const User = use('App/Models/User');
const moment = require('moment');

trait('Test/ApiClient');

test('POST user.store (200)', async ({ client }) => {
  const fakeUser = await Factory.get('App/Models/User').make();

  const response = await client
    .post('/users')
    .send({
      ...fakeUser,
      password: 'asdasdasd',
      birthday: moment()
        .subtract(50, 'years')
        .toISOString(),
    })
    .end();

  response.assertStatus(200);
});

test('POST user.store (200)', async ({ client, assert }) => {
  const usersAmountBefore = (await User.all()).rows.length;

  const fakeUser = await Factory.get('App/Models/User').make({
    password: 'asdasdasd',
  });

  await client
    .post('/users')
    .send({
      ...fakeUser,
      birthday: moment()
        .subtract(30, 'years')
        .toISOString(),
    })
    .end();

  const usersAmountAfter = (await User.all()).rows.length;

  assert.equal(usersAmountBefore + 1, usersAmountAfter);
});

test('GET user.show (200)', async ({ client, assert }) => {
  const fakeUser = await Factory.model('App/Models/User').create();

  const response = await client.get(`/users/${fakeUser.id}`).end();

  response.assertStatus(200);

  assert.containsAllKeys(fakeUser.toJSON(), response.body);
});

test('POST user.store (422) empty password', async ({ client }) => {
  const fakeUser = await Factory.get('App/Models/User').make({
    password: 'asdasdasd',
  });

  const response = await client
    .post('/users')
    .send({
      ...fakeUser,
      password: null,
    })
    .end();

  response.assertStatus(422);
}).timeout(0);

test('POST user.store (422) empty email', async ({ client }) => {
  const fakeUser = await Factory.get('App/Models/User').make({
    password: 'asdasdasd',
  });

  const response = await client
    .post('/users')
    .send({
      ...fakeUser,
      email: null,
    })
    .end();

  response.assertStatus(422);
});

test('POST user.store (422) age < 21', async ({ client }) => {
  const fakeUser = await Factory.get('App/Models/User').make({
    password: 'asdasdasd',
  });

  const response = await client
    .post('/users')
    .send({
      ...fakeUser,
      email: null,
      birthday: moment().toISOString(),
    })
    .end();

  response.assertStatus(422);
});
