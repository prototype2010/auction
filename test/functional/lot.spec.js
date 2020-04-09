/* eslint-disable */

const { test, trait } = use('Test/Suite')('Lot');
const Factory = use('Factory');
const Lot = use('App/Models/Lot');

trait('Test/ApiClient');
trait('Auth/Client');

const path = require('path');
const moment = require('moment');

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
    .loginVia(user, 'jwt')
    .end();

  assert.containsAllKeys(lotResponse.body, ['title', 'currentPrice', 'estimatedPrice','lotStartTime','lotEndTime','user_id','image','created_at','updated_at','id','status']);
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
  assert.containsAllKeys(lotResponse.body, ['title', 'currentPrice', 'estimatedPrice','lotStartTime','lotEndTime','user_id','image','created_at','updated_at','id','status']);
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
});


test('POST 422 Lot can\'t be created with wrong date (start in the past)', async ({ assert, client }) => {

  const user = await createUser();
  const lot = await makeLot({
    lotStartTime : moment().subtract(1,'hour').toISOString()
  });

  const lotResponse = await client.post('/lots')
    .send(lot.toJSON())
    .loginVia(user.toJSON(), 'jwt')
    .end();

  assert.equal(lotResponse.body[0].message, 'Auction can\'t be started in the past' )

  lotResponse.assertStatus(422);
});


test('POST 422 Lot can\'t be created with wrong date (end before it starts)', async ({ assert, client }) => {

  const user = await createUser();
  const lot = await makeLot({
    lotStartTime : moment().add(1,'hour').toISOString(),
    lotEndTime : moment().subtract(2,'hour').toISOString()
  });

  const lotResponse = await client.post('/lots')
    .send(lot.toJSON())
    .loginVia(user.toJSON(), 'jwt')
    .end();

  assert.equal(lotResponse.body[0].message, 'Auction can\'t end before it starts' )

  lotResponse.assertStatus(422);
});




test('POST 422 Lot can\'t be created with wrong date (can\'t be less than an hour)', async ({ assert, client }) => {

  const user = await createUser();
  const lot = await makeLot({
    lotStartTime : moment().add(60,'minutes').toISOString(),
    lotEndTime : moment().add(70,'minutes').toISOString()
  });

  const lotResponse = await client.post('/lots')
    .send(lot.toJSON())
    .loginVia(user.toJSON(), 'jwt')
    .end();

  assert.equal(lotResponse.body[0].message, 'Auction can\'t last less than an hour ' );

  lotResponse.assertStatus(422);
});

test('POST 422 Lot can\'t be created with wrong estimated price', async ({ assert, client }) => {

  const user = await createUser();
  const lot = await makeLot({
    currentPrice: 10,
    estimatedPrice: 9,
  });

  const lotResponse = await client.post('/lots')
    .send(lot.toJSON())
    .loginVia(user.toJSON(), 'jwt')
    .end();

  assert.equal(lotResponse.body[0].message, 'Estimated price cannot be lower than current price');

  lotResponse.assertStatus(422);
});



test('POST 422 Lot can\'t be created with current price = 0', async ({ assert, client }) => {

  const user = await createUser();
  const lot = await makeLot({
    currentPrice: 0,
  });

  const lotResponse = await client.post('/lots')
    .send(lot.toJSON())
    .loginVia(user.toJSON(), 'jwt')
    .end();

  assert.equal(lotResponse.body[0].message, 'Prices cannot be equal or less than zero');

  lotResponse.assertStatus(422);
});




test('POST 422 Lot can\'t be created with estimated price = 0', async ({ assert, client }) => {

  const user = await createUser();
  const lot = await makeLot({
    estimatedPrice: 0,
  });

  const lotResponse = await client.post('/lots')
    .send(lot.toJSON())
    .loginVia(user.toJSON(), 'jwt')
    .end();

  assert.equal(lotResponse.body[0].message, 'Prices cannot be equal or less than zero');

  lotResponse.assertStatus(422);
});

test('POST 422 Lot can\'t be created with both current and estimated price = 0', async ({ assert, client }) => {

  const user = await createUser();
  const lot = await makeLot({
    estimatedPrice: 0,
    currentPrice: 0,
  });

  const lotResponse = await client.post('/lots')
    .send(lot.toJSON())
    .loginVia(user.toJSON(), 'jwt')
    .end();

  assert.equal(lotResponse.body[0].message, 'Prices cannot be equal or less than zero');

  lotResponse.assertStatus(422);
});

test('POST 422 Lot can\'t be created with both current and estimated price string', async ({ assert, client }) => {

  const user = await createUser();
  const lot = await makeLot({
    estimatedPrice: '100$',
    currentPrice: 999,
  });

  const lotResponse = await client.post('/lots')
    .send(lot.toJSON())
    .loginVia(user.toJSON(), 'jwt')
    .end();

  assert.equal(lotResponse.body[0].message, 'number validation failed on estimatedPrice');

  lotResponse.assertStatus(422);
});



test('POST 200 Lot is created with pending status', async ({ assert, client }) => {

  const user = await createUser();
  const lot = await makeLot();

  const lotResponse = await client.post('/lots')
    .send(lot.toJSON())
    .loginVia(user.toJSON(), 'jwt')
    .end();

  const dbLot = await Lot.find(lotResponse.body.id);

  assert.equal(dbLot.status, 'pending');

  lotResponse.assertStatus(200);
});


