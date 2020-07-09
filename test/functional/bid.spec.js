'use strict';

const { test, trait } = use('Test/Suite')('Bid');
const Factory = use('Factory');

trait('Test/ApiClient');
trait('Auth/Client');

const Bid = use('App/Models/Bid');

const { getUserToken, getDBRowsNumber, createUser, makeLot, waitFor } = require('../utils');

trait('Test/ApiClient');

test('Bid can be created', async () => {
  const creator = await Factory.model('App/Models/User').create();
  const bidder = await Factory.model('App/Models/User').create();
  const lot = await Factory.model('App/Models/Lot').make();

  await creator.lots().save(lot);

  const bid = await Factory.model('App/Models/Bid').make();

  bid.proposedPrice = lot.currentPrice + 1;
  bid.lot_id = lot.id;

  await bidder.bids().save(bid);
});

test('One bid is being created', async ({ client, assert }) => {
  const creatorUser = await Factory.model('App/Models/User').create();
  const bidderUser = await Factory.model('App/Models/User').create();
  const lot = await Factory.model('App/Models/Lot').make();

  await creatorUser.lots().save(lot);

  const bid = await Factory.model('App/Models/Bid').make();

  bid.lotId = lot.id;
  bid.proposedPrice = lot.currentPrice + 1;

  const bidsAmountBefore = await getDBRowsNumber(Bid);

  const resp = await client.post('/bids')
    .send(bid.toJSON())
    .loginVia(bidderUser.toJSON(), 'jwt')
    .end();

  const bidsAmountAfter = await getDBRowsNumber(Bid);

  assert.equal(bidsAmountBefore + 1, bidsAmountAfter);
}).timeout(0);
