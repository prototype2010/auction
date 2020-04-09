/* eslint-disable */

const Helpers = use('Helpers')

const { test, trait } = use('Test/Suite')('Lot');
const Factory = use('Factory');
const Lot = use('App/Models/Lot');

trait('Test/ApiClient');

const path = require('path');
const faker = require('faker');
const moment = require('moment');

const { getUserToken, createLotWithParams, getDBRowsNumber } = require('../utils');

test('Lot can be created', async ({ assert, client }) => {
  const lotsAmountBefore = await getDBRowsNumber(Lot);

  await createLotWithParams(client);

  const lotsAmountAfter = await getDBRowsNumber(Lot);

  assert.equal(lotsAmountBefore + 1, lotsAmountAfter);
});

test('POST 200 Lot can be created', async ({ assert, client }) => {
  const lotResponse = await createLotWithParams(client);

  lotResponse.assertStatus(200);
});

test('POST 200 Lot contains all required keys', async ({ assert, client }) => {
  const {body} = await createLotWithParams(client);

  assert.containsAllKeys(body, ['title', 'currentPrice', 'estimatedPrice','lotStartTime','lotEndTime','user_id','image','created_at','updated_at','id']);
});


test('POST 200 Lot can be created by http', async ({ assert, client }) => {

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
  assert.containsAllKeys(lotResponse.body, ['title', 'currentPrice', 'estimatedPrice','lotStartTime','lotEndTime','user_id','image','created_at','updated_at','id']);

});
