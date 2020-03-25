const { test, trait } = use('Test/Suite')('Lot');
const Factory = use('Factory');
const Lot = use('App/Models/Lot');

trait('Test/ApiClient');

test('Lot can be created', async ({ assert }) => {
  const lotsAmountBefore = (await Lot.all()).rows.length;

  const user = await Factory.model('App/Models/User').create();
  const lot = await Factory.model('App/Models/Lot').make();

  await user.lots().save(lot);

  const lotsAmountAfter = (await Lot.all()).rows.length;

  assert.equal(lotsAmountBefore + 1, lotsAmountAfter);
});
