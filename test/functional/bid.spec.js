'use strict';

const moment = require('moment');

const { test, trait } = use('Test/Suite')('Bid');
const Factory = use('Factory');

trait('Test/ApiClient');

test('Bid can be created', async () => {
  const creatorUser = await Factory.model('App/Models/User').create();
  const bidderUser = await Factory.model('App/Models/User').create();
  const lot = await Factory.model('App/Models/Lot').make();

  const { currentPrice, lotStartTime } = lot.toJSON();

  await creatorUser.lots().save(lot);

  const bid = await Factory.model('App/Models/Bid').make();

  bid.proposedPrice = currentPrice + 1;
  bid.creationTime = moment(lotStartTime).add(1, 'minutes');
  bid.lot_id = lot.id;

  await bidderUser.bids().save(bid);
}).timeout(0);
