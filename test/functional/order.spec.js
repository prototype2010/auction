'use strict';

const { test, trait } = use('Test/Suite')('Bid');

const Factory = use('Factory');
const Lot = use('App/Models/Lot');
const Order = use('App/Models/Order');

const { getDBRowsNumber } = require('../utils');

trait('Test/ApiClient');
trait('Auth/Client');

test('Order can be created', async ({ client }) => {
  const creator = await Factory.model('App/Models/User').create();
  const bidder = await Factory.model('App/Models/User').create();
  const lot = await Factory.model('App/Models/Lot').make();

  await creator.lots().save(lot);

  const bid = await Factory.model('App/Models/Bid').make();

  bid.proposed_price = lot.currentPrice + 1;
  bid.lot_id = lot.id;

  await bidder.bids().save(bid);

  const lotToOrder = await Lot.find(lot.id);

  lotToOrder.winner_id = bidder.id;
  lotToOrder.status = 'closed';
  await lotToOrder.save();

  const order = await client.post('/orders')
    .send({
      lotId: lot.id,
      arrivalLocation: 'The best arrival location 1, room 206',
      arrivalType: 'DHL Express',
    })
    .loginVia(bidder.toJSON(), 'jwt')
    .end();

  order.assertStatus(200);
}).timeout(0);

test('One order has been created', async ({ client, assert }) => {
  const creator = await Factory.model('App/Models/User').create();
  const bidder = await Factory.model('App/Models/User').create();
  const lot = await Factory.model('App/Models/Lot').make();

  await creator.lots().save(lot);

  const bid = await Factory.model('App/Models/Bid').make();

  bid.proposed_price = lot.currentPrice + 1;
  bid.lot_id = lot.id;

  await bidder.bids().save(bid);

  const lotToOrder = await Lot.find(lot.id);

  lotToOrder.winner_id = bidder.id;
  lotToOrder.status = 'closed';
  await lotToOrder.save();

  const amountBefore = await getDBRowsNumber(Order);

  await client.post('/orders')
    .send({
      lotId: lot.id,
      arrivalLocation: 'The best arrival location 1, room 206',
      arrivalType: 'DHL Express',
    })
    .loginVia(bidder.toJSON(), 'jwt')
    .end();


  const amountAfter = await getDBRowsNumber(Order);

  assert.equal(amountBefore + 1, amountAfter);
});

test('cannot be created on unfinished lot', async ({ client }) => {
  const creator = await Factory.model('App/Models/User').create();
  const bidder = await Factory.model('App/Models/User').create();
  const lot = await Factory.model('App/Models/Lot').make();

  await creator.lots().save(lot);

  const bid = await Factory.model('App/Models/Bid').make();

  bid.proposed_price = lot.currentPrice + 1;
  bid.lot_id = lot.id;

  await bidder.bids().save(bid);

  const order = await client.post('/orders')
    .send({
      lotId: lot.id,
      arrivalLocation: 'The best arrival location 1, room 206',
      arrivalType: 'DHL Express',
    })
    .loginVia(bidder.toJSON(), 'jwt')
    .end();

  order.assertStatus(422);
});

test('Order structure should match', async ({ client, assert }) => {
  const creator = await Factory.model('App/Models/User').create();
  const bidder = await Factory.model('App/Models/User').create();
  const lot = await Factory.model('App/Models/Lot').make();

  await creator.lots().save(lot);

  const bid = await Factory.model('App/Models/Bid').make();

  bid.proposed_price = lot.currentPrice + 1;
  bid.lot_id = lot.id;

  await bidder.bids().save(bid);

  const lotToOrder = await Lot.find(lot.id);

  lotToOrder.winner_id = bidder.id;
  lotToOrder.status = 'closed';
  await lotToOrder.save();

  const order = await client.post('/orders')
    .send({
      lotId: lot.id,
      arrivalLocation: 'The best arrival location 1, room 206',
      arrivalType: 'DHL Express',
    })
    .loginVia(bidder.toJSON(), 'jwt')
    .end();

  assert.containsAllKeys(order.body, ['arrival_location', 'arrival_type', 'user_id', 'status', 'lot_id', 'created_at', 'updated_at', 'id']);
  assert.isOk(order.body.arrival_type);
  assert.isOk(order.body.status);
  assert.equal(order.body.status, 'pending');
  assert.isOk(order.body.user_id);
  assert.isOk(order.body.arrival_location);
  assert.isOk(order.body.lot_id);
  assert.isOk(order.body.created_at);
  assert.isOk(order.body.updated_at);
  assert.isOk(order.body.id);
});


test('Order can be updated', async ({ client, assert }) => {
  const creator = await Factory.model('App/Models/User').create();
  const bidder = await Factory.model('App/Models/User').create();
  const lot = await Factory.model('App/Models/Lot').make();

  await creator.lots().save(lot);

  const bid = await Factory.model('App/Models/Bid').make();

  bid.proposed_price = lot.currentPrice + 1;
  bid.lot_id = lot.id;

  await bidder.bids().save(bid);

  const lotToOrder = await Lot.find(lot.id);

  lotToOrder.winner_id = bidder.id;
  lotToOrder.status = 'closed';
  await lotToOrder.save();

  const order = await client.post('/orders')
    .send({
      lotId: lot.id,
      arrivalLocation: 'The best arrival location 1, room 206',
      arrivalType: 'DHL Express',
    })
    .loginVia(bidder.toJSON(), 'jwt')
    .end();

  const newLocation = 'The best arrival location 767777, room 206';

  const updatedOrder = await client.put(`/orders/${order.body.id}`)
    .send({
      lotId: lot.id,
      arrivalLocation: newLocation,
      arrivalType: 'DHL Express',
    })
    .loginVia(bidder.toJSON(), 'jwt')
    .end();

  assert.equal(updatedOrder.body.arrival_location, newLocation);

  order.assertStatus(200);
});

test('Order lot cannot be updated', async ({ client }) => {
  const creator = await Factory.model('App/Models/User').create();
  const bidder = await Factory.model('App/Models/User').create();
  const lot = await Factory.model('App/Models/Lot').make();

  await creator.lots().save(lot);

  const bid = await Factory.model('App/Models/Bid').make();

  bid.proposed_price = lot.currentPrice + 1;
  bid.lot_id = lot.id;

  await bidder.bids().save(bid);

  const lotToOrder = await Lot.find(lot.id);

  lotToOrder.winner_id = bidder.id;
  lotToOrder.status = 'closed';
  await lotToOrder.save();

  const order = await client.post('/orders')
    .send({
      lotId: lot.id,
      arrivalLocation: 'The best arrival location 1, room 206',
      arrivalType: 'DHL Express',
    })
    .loginVia(bidder.toJSON(), 'jwt')
    .end();

  const newLocation = 'The best arrival location 1, room 206, Donkey Cong country';

  const updatedOrder = await client.put(`/orders/${order.body.id}`)
    .send({
      lotId: 77777,
      arrivalLocation: newLocation,
      arrivalType: 'DHL Express',
    })
    .loginVia(bidder.toJSON(), 'jwt')
    .end();

  updatedOrder.assertStatus(422);
});

test('Order cannot be updated with incorrect delivery type', async ({ client }) => {
  const creator = await Factory.model('App/Models/User').create();
  const bidder = await Factory.model('App/Models/User').create();
  const lot = await Factory.model('App/Models/Lot').make();

  await creator.lots().save(lot);

  const bid = await Factory.model('App/Models/Bid').make();

  bid.proposed_price = lot.currentPrice + 1;
  bid.lot_id = lot.id;

  await bidder.bids().save(bid);

  const lotToOrder = await Lot.find(lot.id);

  lotToOrder.winner_id = bidder.id;
  lotToOrder.status = 'closed';
  await lotToOrder.save();

  const order = await client.post('/orders')
    .send({
      lotId: lot.id,
      arrivalLocation: 'The best arrival location 1, room 206',
      arrivalType: 'DHL Express',
    })
    .loginVia(bidder.toJSON(), 'jwt')
    .end();

  const updatedOrder = await client.put(`/orders/${order.body.id}`)
    .send({
      lotId: 77777,
      arrivalLocation: 'The best arrival location 1, room 206,Donkey Cong country',
      arrivalType: 'Nova pochta',
    })
    .loginVia(bidder.toJSON(), 'jwt')
    .end();

  updatedOrder.assertStatus(422);
});
/* eslint-disable */

test('Order cannot be created with incorrect delivery type', async ({ client }) => {
  const creator = await Factory.model('App/Models/User').create();
  const bidder = await Factory.model('App/Models/User').create();
  const lot = await Factory.model('App/Models/Lot').make();

  await creator.lots().save(lot);

  const bid = await Factory.model('App/Models/Bid').make();

  bid.proposed_price = lot.currentPrice + 1;
  bid.lot_id = lot.id;

  await bidder.bids().save(bid);

  const lotToOrder = await Lot.find(lot.id);

  lotToOrder.winner_id = bidder.id;
  lotToOrder.status = 'closed';
  await lotToOrder.save();

  const order = await client.post('/orders')
    .send({
      lotId: lot.id,
      arrivalLocation: 'The best arrival location 1, room 206',
      arrivalType: 'Ukrpochta',
    })
    .loginVia(bidder.toJSON(), 'jwt')
    .end();


  order.assertStatus(422);
}).timeout(0);

test('Order can be created via factory', async ({ client, assert }) => {
  const creator = await Factory.model('App/Models/User').create();
  const bidder = await Factory.model('App/Models/User').create();
  const lot = await Factory.model('App/Models/Lot').make();

  await creator.lots().save(lot);

  const bid = await Factory.model('App/Models/Bid').make();

  bid.proposed_price = lot.currentPrice + 1;
  bid.lot_id = lot.id;

  await bidder.bids().save(bid);

  lot.winner_id = bidder.id;
  lot.status = 'closed';

  await lot.save();

  const order = await Factory.model('App/Models/Order').make();

  order.user_id = bidder.id;
  order.lot_id = lot.id;

  await order.save();

  const savedOrder = await Order.find(order.id)

  const orderJSON = savedOrder.toJSON()

  assert.containsAllKeys(orderJSON, ['arrival_location', 'arrival_type', 'user_id', 'status', 'lot_id', 'created_at', 'updated_at', 'id']);
  assert.isOk(orderJSON.arrival_type);
  assert.isOk(orderJSON.status);
  assert.equal(orderJSON.status, 'pending');
  assert.isOk(orderJSON.user_id);
  assert.isOk(orderJSON.arrival_location);
  assert.isOk(orderJSON.lot_id);
  assert.isOk(orderJSON.created_at);
  assert.isOk(orderJSON.updated_at);
  assert.isOk(orderJSON.id);

}).timeout(0);

test('Order can be approved', async ({ client, assert }) => {
  const creator = await Factory.model('App/Models/User').create();
  const bidder = await Factory.model('App/Models/User').create();
  const lot = await Factory.model('App/Models/Lot').make();

  await creator.lots().save(lot);

  const bid = await Factory.model('App/Models/Bid').make();

  bid.proposed_price = lot.currentPrice + 1;
  bid.lot_id = lot.id;

  await bidder.bids().save(bid);

  lot.winner_id = bidder.id;
  lot.status = 'closed';

  await lot.save();

  const order = await Factory.model('App/Models/Order').make();

  order.user_id = bidder.id;
  order.lot_id = lot.id;

  await order.save();

  const approval = await client.post(`/orders/approve-sent/${order.id}`)
    .send()
    .loginVia(creator.toJSON(), 'jwt')
    .end();


  approval.assertStatus(200);

}).timeout(0);
