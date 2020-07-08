'use strict';

const { test, trait } = use('Test/Suite')('Bid');
const Factory = use('Factory');

const { getUserToken, getDBRowsNumber, createUser, makeLot, waitFor } = require('../utils');

trait('Test/ApiClient');

test('Bid can be created', async () => {
  const creator = await Factory.model('App/Models/User').create();
  const bidder = await Factory.model('App/Models/User').create();
  const lot = await Factory.model('App/Models/Lot').make();

  const { currentPrice } = lot.toJSON();

  await creator.lots().save(lot);

  const bid = await Factory.model('App/Models/Bid').make();

  bid.proposedPrice = currentPrice + 1;
  bid.lot_id = lot.id;

  await bidder.bids().save(bid);
});

test('One bid is being created', async () => {
  const creatorUser = await Factory.model('App/Models/User').create();
  const bidderUser = await Factory.model('App/Models/User').create();
  const lot = await Factory.model('App/Models/Lot').make();

  const { currentPrice } = lot.toJSON();

  await creatorUser.lots().save(lot);

  const bid = await Factory.model('App/Models/Bid').make();

  bid.proposedPrice = currentPrice + 1;
  bid.lot_id = lot.id;

  await bidderUser.bids().save(bid);
});
