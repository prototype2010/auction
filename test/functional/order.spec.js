'use strict';

const { test, trait } = use('Test/Suite')('Bid');

const Factory = use('Factory');
const Lot = use('App/Models/Lot');

// const { getDBRowsNumber } = require('../utils');

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
      arrivalLocation: 'Home',
      arrivalType: 'DHL Express',
    })
    .loginVia(bidder.toJSON(), 'jwt')
    .end();

  order.assertStatus(200);
}).timeout(0);
