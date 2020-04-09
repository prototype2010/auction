/* eslint-disable */

const { test, trait } = use('Test/Suite')('Lot');
const Factory = use('Factory');
const Lot = use('App/Models/Lot');

trait('Test/ApiClient');
trait('Auth/Client');

const path = require('path');

const { getUserToken, getDBRowsNumber, createUser, makeLot } = require('../utils');

test('Lot can be created', async ({ assert, client }) => {
  const lotsAmountBefore = await getDBRowsNumber(Lot);

  const user = await createUser();
  const lot = await makeLot()

  await client.post('/lots')
    .send(lot.toJSON())
    .loginVia(user.toJSON(), 'jwt')
    .end();

  const lotsAmountAfter = await getDBRowsNumber(Lot);

  assert.equal(lotsAmountBefore + 1, lotsAmountAfter);
});

test('POST 200 Lot can be created', async ({ assert, client }) => {

  const user = await createUser();
  const lot = await makeLot()

  const lotResponse = await client.post('/lots')
    .send(lot.toJSON())
    .loginVia(user.toJSON(), 'jwt')
    .end();

  lotResponse.assertStatus(200);
});

test('POST 200 Lot contains all required keys', async ({ assert, client }) => {
  const user = await createUser();
  const lot = await makeLot()

  const lotResponse = await client.post('/lots')
    .send(lot.toJSON())
    .loginVia(user.toJSON(), 'jwt')
    .end();


  assert.containsAllKeys(lotResponse.body, ['title', 'currentPrice', 'estimatedPrice','lotStartTime','lotEndTime','user_id','image','created_at','updated_at','id']);
});


test('POST 200 Lot can be created by http', async ({ assert, client }) => {

  const user = await createUser();
  const {title,description, currentPrice, estimatedPrice, lotStartTime, lotEndTime  } = await Factory.get('App/Models/Lot').make();

  const lotResponse = await client.post('/lots')
    .field('title',title)
    .field('description',description)
    .field('currentPrice',currentPrice)
    .field('estimatedPrice',estimatedPrice)
    .field('lotStartTime',lotStartTime)
    .field('lotEndTime',lotEndTime)
    .loginVia(user,'jwt')
    .end();

  lotResponse.assertStatus(200);
  assert.containsAllKeys(lotResponse.body, ['title', 'currentPrice', 'estimatedPrice','lotStartTime','lotEndTime','user_id','image','created_at','updated_at','id']);
});

test('POST 200 Image can be attached', async ({ assert, client }) => {

  const { token } = (await getUserToken(client)).body;
  const {title,description, currentPrice, estimatedPrice, lotStartTime, lotEndTime  } = await Factory.get('App/Models/Lot').make();

  const lotResponse = await client.post('/lots')
    .header('Authorization', `bearer ${token}`)
    .field('title',title)
    .field('description',description)
    .field('currentPrice',currentPrice)
    .field('estimatedPrice',estimatedPrice)
    .field('lotStartTime',lotStartTime)
    .field('lotEndTime',lotEndTime)
    .attach('image', path.resolve(__dirname, `../testData/small_image.png`))
    .end();

  lotResponse.assertStatus(200);

  assert.exists(lotResponse.body.image);
  assert.containsAllKeys(lotResponse.body, ['title', 'currentPrice', 'estimatedPrice','lotStartTime','lotEndTime','user_id','image','created_at','updated_at','id']);
});
