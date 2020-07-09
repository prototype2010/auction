'use strict';

const { test, trait } = use('Test/Suite')('Bid');
const Factory = use('Factory');

trait('Test/ApiClient');
trait('Auth/Client');

const Bid = use('App/Models/Bid');
const Lot = use('App/Models/Lot');
const Event = use('Event');

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

  const bidsAmountBefore = await getDBRowsNumber(Bid);

  await client.post('/bids')
    .send({
      lotId: lot.id,
      proposedPrice: lot.estimatedPrice + 1,
    })
    .loginVia(bidderUser.toJSON(), 'jwt')
    .end();

  const bidsAmountAfter = await getDBRowsNumber(Bid);

  assert.equal(bidsAmountBefore + 1, bidsAmountAfter);
});

test('POST 200 One bid is being created', async ({ client }) => {
  const creatorUser = await Factory.model('App/Models/User').create();
  const bidderUser = await Factory.model('App/Models/User').create();
  const lot = await Factory.model('App/Models/Lot').make();

  lot.status = 'inProcess';

  await creatorUser.lots().save(lot);

  const resp = await client.post('/bids')
    .send({
      lotId: lot.id,
      proposedPrice: lot.estimatedPrice + 1,
    })
    .loginVia(bidderUser.toJSON(), 'jwt')
    .end();

  resp.assertStatus(200);
});

test('POST 422 Cannot bid on inactive lot', async ({ client }) => {
  const creatorUser = await Factory.model('App/Models/User').create();
  const bidderUser = await Factory.model('App/Models/User').create();
  const lot = await Factory.model('App/Models/Lot').make();

  lot.status = 'pending';

  await creatorUser.lots().save(lot);

  const resp = await client.post('/bids')
    .send({
      lotId: lot.id,
      proposedPrice: lot.estimatedPrice + 1,
    })
    .loginVia(bidderUser.toJSON(), 'jwt')
    .end();

  resp.assertStatus(422);
});

test('POST 422 Bid cannot be zero', async ({ client }) => {
  const creatorUser = await Factory.model('App/Models/User').create();
  const bidderUser = await Factory.model('App/Models/User').create();
  const lot = await Factory.model('App/Models/Lot').make();

  lot.status = 'inProcess';

  await creatorUser.lots().save(lot);

  const resp = await client.post('/bids')
    .send({
      lotId: lot.id,
      proposedPrice: 0,
    })
    .loginVia(bidderUser.toJSON(), 'jwt')
    .end();

  resp.assertStatus(422);
});


test('POST 422 Bid cannot be negative', async ({ client }) => {
  const creatorUser = await Factory.model('App/Models/User').create();
  const bidderUser = await Factory.model('App/Models/User').create();
  const lot = await Factory.model('App/Models/Lot').make();

  lot.status = 'inProcess';

  await creatorUser.lots().save(lot);

  const resp = await client.post('/bids')
    .send({
      lotId: lot.id,
      proposedPrice: -100500,
    })
    .loginVia(bidderUser.toJSON(), 'jwt')
    .end();

  resp.assertStatus(422);
});


test('POST 422 Bid cannot be done for closed lot', async ({ client }) => {
  const creatorUser = await Factory.model('App/Models/User').create();
  const bidderUser = await Factory.model('App/Models/User').create();
  const lot = await Factory.model('App/Models/Lot').make();

  lot.status = 'closed';

  await creatorUser.lots().save(lot);

  const resp = await client.post('/bids')
    .send({
      lotId: lot.id,
      proposedPrice: lot.currentPrice + 1,
    })
    .loginVia(bidderUser.toJSON(), 'jwt')
    .end();

  resp.assertStatus(422);
});


test('POST 200 Bid can be done with estimated price', async ({ client }) => {
  const creatorUser = await Factory.model('App/Models/User').create();
  const bidderUser = await Factory.model('App/Models/User').create();
  const lot = await Factory.model('App/Models/Lot').make();

  lot.status = 'inProcess';

  await creatorUser.lots().save(lot);

  const resp = await client.post('/bids')
    .send({
      lotId: lot.id,
      proposedPrice: lot.estimatedPrice,
    })
    .loginVia(bidderUser.toJSON(), 'jwt')
    .end();

  resp.assertStatus(200);
});


test('POST 200 Bid can be done with over estimated price', async ({ client }) => {
  const creatorUser = await Factory.model('App/Models/User').create();
  const bidderUser = await Factory.model('App/Models/User').create();
  const lot = await Factory.model('App/Models/Lot').make();

  lot.status = 'inProcess';

  await creatorUser.lots().save(lot);

  const resp = await client.post('/bids')
    .send({
      lotId: lot.id,
      proposedPrice: lot.estimatedPrice + 1,
    })
    .loginVia(bidderUser.toJSON(), 'jwt')
    .end();

  resp.assertStatus(200);
});

test('POST 422 Bid cannot be done with over lower than estimated price', async ({ client }) => {
  const creatorUser = await Factory.model('App/Models/User').create();
  const bidderUser = await Factory.model('App/Models/User').create();
  const lot = await Factory.model('App/Models/Lot').make();

  lot.status = 'inProcess';

  await creatorUser.lots().save(lot);

  const resp = await client.post('/bids')
    .send({
      lotId: lot.id,
      proposedPrice: lot.estimatedPrice - 1,
    })
    .loginVia(bidderUser.toJSON(), 'jwt')
    .end();

  resp.assertStatus(422);
});

test('POST 200 Bid JSON structure looks as expected', async ({ client, assert }) => {
  const creatorUser = await Factory.model('App/Models/User').create();
  const bidderUser = await Factory.model('App/Models/User').create();
  const lot = await Factory.model('App/Models/Lot').make();

  lot.status = 'inProcess';

  await creatorUser.lots().save(lot);

  const resp = await client.post('/bids')
    .send({
      lotId: lot.id,
      proposedPrice: lot.estimatedPrice + 1,
    })
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
});


test('PUT 200 Bid can be updated', async ({ client }) => {
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
    .send({
      lotId: lot.id,
      proposedPrice: lot.estimatedPrice + 1,
    })
    .loginVia(bidderUser.toJSON(), 'jwt')
    .end();

  resp.assertStatus(200);
});

test('PUT 422 Bid cannot be updated with lower than estimate price', async ({ client }) => {
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
    .send({
      lotId: lot.id,
      proposedPrice: lot.currentPrice - 1,
    })
    .loginVia(bidderUser.toJSON(), 'jwt')
    .end();

  resp.assertStatus(422);
});

test('PUT 200 Updated bid price is updated', async ({ client, assert }) => {
  const creatorUser = await Factory.model('App/Models/User').create();
  const bidderUser = await Factory.model('App/Models/User').create();
  const lot = await Factory.model('App/Models/Lot').make();

  lot.status = 'inProcess';

  await creatorUser.lots().save(lot);

  const bid = await Factory.model('App/Models/Bid').make();

  const newPrice = lot.estimatedPrice + 1;

  bid.lot_id = lot.id;
  bid.proposed_price = newPrice;

  await bidderUser.bids().save(bid);

  const resp = await client.put(`/bids/${bid.id}`)
    .send({ lotId: lot.id, proposedPrice: newPrice })
    .loginVia(bidderUser.toJSON(), 'jwt')
    .end();

  resp.assertStatus(200);

  assert.equal(newPrice, resp.body.proposed_price);
});


test('Raise bid should throw raise event', async ({ client, assert }) => {
  const creatorUser = await Factory.model('App/Models/User').create();
  const bidderUser = await Factory.model('App/Models/User').create();
  const lot = await Factory.model('App/Models/Lot').make();

  lot.status = 'inProcess';

  await creatorUser.lots().save(lot);

  Event.fake();

  const bid = await client.post('/bids')
    .send({
      lotId: lot.id,
      proposedPrice: lot.estimatedPrice + 1,
    })
    .loginVia(bidderUser.toJSON(), 'jwt')
    .end();

  const { event, data } = Event.recent();

  assert.equal(event, 'bid::new');
  assert.deepEqual(data[0].toJSON(), bid.body);

  Event.restore();
});
test('After raise lot current price should be higher', async ({ client, assert }) => {
  const creatorUser = await Factory.model('App/Models/User').create();
  const bidderUser = await Factory.model('App/Models/User').create();
  const lot = await Factory.model('App/Models/Lot').make();

  lot.status = 'inProcess';

  await creatorUser.lots().save(lot);

  const newPrice = lot.currentPrice + 1;
  const bid = await client.post('/bids')
    .send({
      lotId: lot.id,
      proposedPrice: newPrice,
    })
    .loginVia(bidderUser.toJSON(), 'jwt')
    .end();

  const updatedLot = await Lot.findBy({ id: lot.id });

  assert.equal(updatedLot.currentPrice, newPrice);
  assert.equal(bid.body.proposed_price, newPrice);
}).timeout(0);

test('PUT 422 closed lot cannot be bidded', async ({ client }) => {
  const creatorUser = await Factory.model('App/Models/User').create();
  const bidderUser = await Factory.model('App/Models/User').create();
  const lot = await Factory.model('App/Models/Lot').make();

  lot.status = 'closed';

  await creatorUser.lots().save(lot);

  const bid = await Factory.model('App/Models/Bid').make();

  const newPrice = lot.estimatedPrice + 1;

  bid.lot_id = lot.id;
  bid.proposed_price = newPrice;

  await bidderUser.bids().save(bid);

  const resp = await client.put(`/bids/${bid.id}`)
    .send({ lotId: lot.id, proposedPrice: newPrice })
    .loginVia(bidderUser.toJSON(), 'jwt')
    .end();

  resp.assertStatus(422);
});

test('DELETE 200 inProcess lot can bidded', async ({ client }) => {
  const creatorUser = await Factory.model('App/Models/User').create();
  const bidderUser = await Factory.model('App/Models/User').create();
  const lot = await Factory.model('App/Models/Lot').make();

  lot.status = 'inProcess';

  await creatorUser.lots().save(lot);

  const bid = await Factory.model('App/Models/Bid').make();

  bid.lot_id = lot.id;
  bid.proposed_price = lot.estimatedPrice + 1;

  await bidderUser.bids().save(bid);

  const resp = await client.delete(`/bids/${bid.id}`)
    .loginVia(bidderUser.toJSON(), 'jwt')
    .end();

  resp.assertStatus(200);
});

test('DELETE 403 bid for closed lot cannot deleted', async ({ client }) => {
  const creatorUser = await Factory.model('App/Models/User').create();
  const bidderUser = await Factory.model('App/Models/User').create();
  const lot = await Factory.model('App/Models/Lot').make();

  lot.status = 'closed';

  await creatorUser.lots().save(lot);

  const bid = await Factory.model('App/Models/Bid').make();

  bid.lot_id = lot.id;
  bid.proposed_price = lot.estimatedPrice + 1;

  await bidderUser.bids().save(bid);

  const resp = await client.delete(`/bids/${bid.id}`)
    .loginVia(bidderUser.toJSON(), 'jwt')
    .end();

  resp.assertStatus(403);
});
