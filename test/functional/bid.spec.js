'use strict';

const { test, trait } = use('Test/Suite')('Bid');
const Factory = use('Factory');

trait('Test/ApiClient');
trait('Auth/Client');

const Bid = use('App/Models/Bid');

const { getDBRowsNumber } = require('../utils');

trait('Test/ApiClient');

test('Bid can be created', async () => {
  const creator = await Factory.model('App/Models/User').create();
  const bidder = await Factory.model('App/Models/User').create();
  const lot = await Factory.model('App/Models/Lot').make();

  await creator.lots().save(lot);

  const bid = await Factory.model('App/Models/Bid').make();

  bid.proposed_price = lot.currentPrice + 1;
  bid.lot_id = lot.id;

  await bidder.bids().save(bid);
});

test('One bid is being created', async ({ client, assert }) => {
  const creatorUser = await Factory.model('App/Models/User').create();
  const bidderUser = await Factory.model('App/Models/User').create();
  const lot = await Factory.model('App/Models/Lot').make();

  lot.status = 'inProcess';

  await creatorUser.lots().save(lot);

  const bid = await Factory.model('App/Models/Bid').make();

  bid.lotId = lot.id;
  bid.proposedPrice = lot.currentPrice + 1;

  const bidsAmountBefore = await getDBRowsNumber(Bid);

  await client.post('/bids')
    .send(bid.toJSON())
    .loginVia(bidderUser.toJSON(), 'jwt')
    .end();

  const bidsAmountAfter = await getDBRowsNumber(Bid);

  assert.equal(bidsAmountBefore + 1, bidsAmountAfter);
}).timeout(0);

test('POST 200 One bid is being created', async ({ client }) => {
  const creatorUser = await Factory.model('App/Models/User').create();
  const bidderUser = await Factory.model('App/Models/User').create();
  const lot = await Factory.model('App/Models/Lot').make();

  lot.status = 'inProcess';

  await creatorUser.lots().save(lot);

  const bid = await Factory.model('App/Models/Bid').make();

  bid.lotId = lot.id;
  bid.proposedPrice = lot.currentPrice + 1;

  const resp = await client.post('/bids')
    .send(bid.toJSON())
    .loginVia(bidderUser.toJSON(), 'jwt')
    .end();

  resp.assertStatus(200);
}).timeout(0);

test('POST 422 Cannot bid on inactive lot', async ({ client }) => {
  const creatorUser = await Factory.model('App/Models/User').create();
  const bidderUser = await Factory.model('App/Models/User').create();
  const lot = await Factory.model('App/Models/Lot').make();

  lot.status = 'pending';

  await creatorUser.lots().save(lot);

  const bid = await Factory.model('App/Models/Bid').make();

  bid.lotId = lot.id;
  bid.proposedPrice = lot.currentPrice + 1;

  const resp = await client.post('/bids')
    .send(bid.toJSON())
    .loginVia(bidderUser.toJSON(), 'jwt')
    .end();

  resp.assertStatus(422);
}).timeout(0);

test('POST 422 Bid cannot be zero', async ({ client }) => {
  const creatorUser = await Factory.model('App/Models/User').create();
  const bidderUser = await Factory.model('App/Models/User').create();
  const lot = await Factory.model('App/Models/Lot').make();

  lot.status = 'inProcess';

  await creatorUser.lots().save(lot);

  const bid = await Factory.model('App/Models/Bid').make();

  bid.lotId = lot.id;
  bid.proposedPrice = 0;

  const resp = await client.post('/bids')
    .send(bid.toJSON())
    .loginVia(bidderUser.toJSON(), 'jwt')
    .end();

  resp.assertStatus(422);
}).timeout(0);


test('POST 422 Bid cannot be negative', async ({ client }) => {
  const creatorUser = await Factory.model('App/Models/User').create();
  const bidderUser = await Factory.model('App/Models/User').create();
  const lot = await Factory.model('App/Models/Lot').make();

  lot.status = 'inProcess';

  await creatorUser.lots().save(lot);

  const bid = await Factory.model('App/Models/Bid').make();

  bid.lotId = lot.id;
  bid.proposedPrice = -100500;

  const resp = await client.post('/bids')
    .send(bid.toJSON())
    .loginVia(bidderUser.toJSON(), 'jwt')
    .end();

  resp.assertStatus(422);
}).timeout(0);


test('POST 422 Bid cannot be done for closed lot', async ({ client }) => {
  const creatorUser = await Factory.model('App/Models/User').create();
  const bidderUser = await Factory.model('App/Models/User').create();
  const lot = await Factory.model('App/Models/Lot').make();

  lot.status = 'closed';

  await creatorUser.lots().save(lot);

  const bid = await Factory.model('App/Models/Bid').make();

  bid.lotId = lot.id;
  bid.proposedPrice = lot.currentPrice + 1;

  const resp = await client.post('/bids')
    .send(bid.toJSON())
    .loginVia(bidderUser.toJSON(), 'jwt')
    .end();

  resp.assertStatus(422);
}).timeout(0);


test('POST 200 Bid can be done with estimated price', async ({ client }) => {
  const creatorUser = await Factory.model('App/Models/User').create();
  const bidderUser = await Factory.model('App/Models/User').create();
  const lot = await Factory.model('App/Models/Lot').make();

  lot.status = 'inProcess';

  await creatorUser.lots().save(lot);

  const bid = await Factory.model('App/Models/Bid').make();

  bid.lotId = lot.id;
  bid.proposedPrice = lot.estimatedPrice;

  const resp = await client.post('/bids')
    .send(bid.toJSON())
    .loginVia(bidderUser.toJSON(), 'jwt')
    .end();

  resp.assertStatus(200);
}).timeout(0);


test('POST 200 Bid can be done with over estimated price', async ({ client }) => {
  const creatorUser = await Factory.model('App/Models/User').create();
  const bidderUser = await Factory.model('App/Models/User').create();
  const lot = await Factory.model('App/Models/Lot').make();

  lot.status = 'inProcess';

  await creatorUser.lots().save(lot);

  const bid = await Factory.model('App/Models/Bid').make();

  bid.lotId = lot.id;
  bid.proposedPrice = lot.estimatedPrice + 1;

  const resp = await client.post('/bids')
    .send(bid.toJSON())
    .loginVia(bidderUser.toJSON(), 'jwt')
    .end();

  resp.assertStatus(200);
}).timeout(0);

test('POST 200 Bid JSON structure looks as expected', async ({ client, assert }) => {
  const creatorUser = await Factory.model('App/Models/User').create();
  const bidderUser = await Factory.model('App/Models/User').create();
  const lot = await Factory.model('App/Models/Lot').make();

  lot.status = 'inProcess';

  await creatorUser.lots().save(lot);

  const bid = await Factory.model('App/Models/Bid').make();

  bid.lotId = lot.id;
  bid.proposedPrice = lot.estimatedPrice + 1;

  const resp = await client.post('/bids')
    .send(bid.toJSON())
    .loginVia(bidderUser.toJSON(), 'jwt')
    .end();

  assert.containsAllKeys(resp.body, ['user_id', 'proposed_price', 'lot_id', 'created_at', 'updated_at', 'id']);
  assert.isOk(resp.body.user_id);
  assert.isOk(resp.body.proposed_price);
  assert.isOk(resp.body.lot_id);
  assert.isOk(resp.body.created_at);
  assert.isOk(resp.body.updated_at);
  assert.isOk(resp.body.id);

  resp.assertStatus(200);
}).timeout(0);


test('POST 200 Bid can be updated', async ({ client }) => {
  const creatorUser = await Factory.model('App/Models/User').create();
  const bidderUser = await Factory.model('App/Models/User').create();
  const lot = await Factory.model('App/Models/Lot').make();

  lot.status = 'inProcess';

  await creatorUser.lots().save(lot);

  const bid = await Factory.model('App/Models/Bid').make();

  bid.lot_id = lot.id;
  bid.proposed_price = lot.estimatedPrice + 1;

  await bidderUser.bids().save(bid);

  const resp = await client.put(`/bids/${bid.id}`)
    .send({ ...bid.toJSON(), lotId: lot.id, proposedPrice: lot.estimatedPrice + 1 })
    .loginVia(bidderUser.toJSON(), 'jwt')
    .end();

  resp.assertStatus(200);
}).timeout(0);
