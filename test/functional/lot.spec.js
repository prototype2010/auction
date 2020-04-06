/* eslint-disable */

const { test, trait } = use('Test/Suite')('Lot');
const Factory = use('Factory');
const Lot = use('App/Models/Lot');

trait('Test/ApiClient');

const faker = require('faker');
const moment = require('moment');
const { getUserToken } = require('../utils');

test('Lot can be created', async ({ assert }) => {
  const lotsAmountBefore = (await Lot.all()).rows.length;

  const user = await Factory.model('App/Models/User').create();
  const lot = await Factory.model('App/Models/Lot').make();

  await user.lots().save(lot);

  const lotsAmountAfter = (await Lot.all()).rows.length;

  assert.equal(lotsAmountBefore + 1, lotsAmountAfter);
});
 //title (required);
// image;
// description;
// status (required);
// created at (required) - need to sort lot’s list by creation time, for pagination;
// current price (required) - represent start price of the lot or max bids’ proposed price, if they exist;
// estimated price (required) - price that is maximum for current lot - if user propose this price, than he can buy the lot immediately;
// lot start time (required) - time when the lot will be open;
// lot end time (required) - time when the lot will be closed.
test('POST 200 Lot can be created', async ({ assert, client }) => {
  const { token } = await getUserToken();

  const lotResponse = await client.post({
    title: faker.internet.firstname(),
    currentPrice: 10,
    estimatedPrice: 15,
    lotStartTime: moment(),
    lotStartEnd: moment().add(24,'hours'),
  })
    .header('Authorization', `bearer ${token}`)
});
