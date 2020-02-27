const { test, trait } = use('Test/Suite')('User');
const Factory = use('Factory');
const User = use('App/Models/User');

trait('Test/ApiClient');

test('POST user.store (200)', async ({ client }) => {

  const fakeUser = await Factory.get('App/Models/User').make({password: 'asdasdasd'});

  const response = await client.post('/users').send(fakeUser).end();

  response.assertStatus(200);
});

test('POST user.store (200)', async ({ client, assert }) => {

  const usersAmountBefore = (await User.all()).rows.length;

  const fakeUser = await Factory.get('App/Models/User').make({password: 'asdasdasd'});

  await client.post('/users').send(fakeUser).end();

  const usersAmountAfter = (await User.all()).rows.length;

  assert.equal(usersAmountBefore + 1, usersAmountAfter);
});

test('GET user.show (200)', async ({ client, assert }) => {

  const fakeUser = await Factory.model('App/Models/User').create();

  const response = await client.get(`/users/${fakeUser.id}`).end();

  response.assertStatus(200);

  assert.containsAllKeys(fakeUser.toJSON(),response.body)

});


test('GET user.store (500)', async ({ client, assert }) => {

  const fakeUser = await Factory.get('App/Models/User').make({password: 'asdasdasd'});

  const response = await client.post('/users').send({
    ...fakeUser,
    password: null,
  }).end();

  response.assertStatus(500);
});


test('GET user.store (500)', async ({ client, assert }) => {

  const fakeUser = await Factory.get('App/Models/User').make({password: 'asdasdasd'});

  const response = await client.post('/users').send({
    ...fakeUser,
    email: null,
  }).end();

  response.assertStatus(500);
});
