/* eslint-disable */

const { test, trait } = use('Test/Suite')('Lot');
const Factory = use('Factory');
const Lot = use('App/Models/Lot');
const Event = use('Event');
const LotManager = use('LotManager');
const fs = require('fs');

const { timeout } = use ('Test/Runner');
timeout(Number.MAX_SAFE_INTEGER);

trait('Test/ApiClient');
trait('Auth/Client');

const path = require('path');
const moment = require('moment');

const { getUserToken, getDBRowsNumber, createUser, makeLot, waitFor } = require('../utils');

test('Lot can be created', async ({ assert, client }) => {
  const lotsAmountBefore = await getDBRowsNumber(Lot);

  const user = await createUser();
  const lot = await makeLot()

  await client.post('/lots')
    .send(lot.toJSON())
    .loginVia(user.toJSON(), 'jwt')
    .end();

  const lotsAmountAfter = await getDBRowsNumber(Lot);

  assert.equal(lotsAmountBefore + 1, lotsAmountAfter);
});

test('POST 200 Lot can be created', async ({ assert, client }) => {

  const user = await createUser();
  const lot = await makeLot()

  const lotResponse = await client.post('/lots')
    .send(lot.toJSON())
    .loginVia(user.toJSON(), 'jwt')
    .end();

  lotResponse.assertStatus(200);
});

test('POST 200 Lot contains all required keys', async ({ assert, client }) => {
  const user = await createUser();
  const lot = await makeLot()

  const lotResponse = await client.post('/lots')
    .send(lot.toJSON())
    .loginVia(user, 'jwt')
    .end();

  const {title, currentPrice, estimatedPrice,lotStartTime,lotEndTime,user_id,image,created_at,updated_at,id,status} = lotResponse.body;

  assert.containsAllKeys(lotResponse.body, ['title', 'currentPrice', 'estimatedPrice','lotStartTime','lotEndTime','user_id','image','created_at','updated_at','id','status']);
  assert.isOk(title);
  assert.isOk(currentPrice);
  assert.isOk(estimatedPrice);
  assert.isOk(lotStartTime);
  assert.isOk(lotEndTime);
  assert.isOk(user_id);
  assert.isOk(created_at);
  assert.isOk(updated_at);
  assert.isOk(status);
  assert.isOk(id);
});


test('POST 200 Lot can be created by http', async ({ assert, client }) => {

  const user = await createUser();
  const {title,description, currentPrice, estimatedPrice, lotStartTime, lotEndTime  } = await Factory.get('App/Models/Lot').make();

  const lotResponse = await client.post('/lots')
    .field('title',title)
    .field('description',description)
    .field('currentPrice',currentPrice)
    .field('estimatedPrice',estimatedPrice)
    .field('lotStartTime',lotStartTime)
    .field('lotEndTime',lotEndTime)
    .loginVia(user,'jwt')
    .end();

  lotResponse.assertStatus(200);
  assert.containsAllKeys(lotResponse.body, ['title', 'currentPrice', 'estimatedPrice','lotStartTime','lotEndTime','user_id','image','created_at','updated_at','id','status']);
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

  assert.exists(lotResponse.body.image);
});


test('POST 422 Lot can\'t be created with wrong date (start in the past)', async ({ assert, client }) => {

  const user = await createUser();
  const lot = await makeLot({
    lotStartTime : moment().subtract(1,'hour').toISOString()
  });

  const lotResponse = await client.post('/lots')
    .send(lot.toJSON())
    .loginVia(user.toJSON(), 'jwt')
    .end();

  assert.equal(lotResponse.body[0].message, 'Auction can\'t be started in the past' )

  lotResponse.assertStatus(422);
});


test('POST 422 Lot can\'t be created with wrong date (end before it starts)', async ({ assert, client }) => {

  const user = await createUser();
  const lot = await makeLot({
    lotStartTime : moment().add(1,'hour').toISOString(),
    lotEndTime : moment().subtract(2,'hour').toISOString()
  });

  const lotResponse = await client.post('/lots')
    .send(lot.toJSON())
    .loginVia(user.toJSON(), 'jwt')
    .end();

  assert.equal(lotResponse.body[0].message, 'Auction can\'t end before it starts' )

  lotResponse.assertStatus(422);
});

test('POST 422 Lot can\'t be created with wrong estimated price', async ({ assert, client }) => {

  const user = await createUser();
  const lot = await makeLot({
    currentPrice: 10,
    estimatedPrice: 9,
  });

  const lotResponse = await client.post('/lots')
    .send(lot.toJSON())
    .loginVia(user.toJSON(), 'jwt')
    .end();

  assert.equal(lotResponse.body[0].message, 'Estimated price cannot be lower than current price');

  lotResponse.assertStatus(422);
});



test('POST 422 Lot can\'t be created with current price = 0', async ({ assert, client }) => {

  const user = await createUser();
  const lot = await makeLot({
    currentPrice: 0,
  });

  const lotResponse = await client.post('/lots')
    .send(lot.toJSON())
    .loginVia(user.toJSON(), 'jwt')
    .end();

  assert.equal(lotResponse.body[0].message, 'Prices cannot be equal or less than zero');

  lotResponse.assertStatus(422);
});




test('POST 422 Lot can\'t be created with estimated price = 0', async ({ assert, client }) => {

  const user = await createUser();
  const lot = await makeLot({
    estimatedPrice: 0,
  });

  const lotResponse = await client.post('/lots')
    .send(lot.toJSON())
    .loginVia(user.toJSON(), 'jwt')
    .end();

  assert.equal(lotResponse.body[0].message, 'Prices cannot be equal or less than zero');

  lotResponse.assertStatus(422);
});

test('POST 422 Lot can\'t be created with both current and estimated price = 0', async ({ assert, client }) => {

  const user = await createUser();
  const lot = await makeLot({
    estimatedPrice: 0,
    currentPrice: 0,
  });

  const lotResponse = await client.post('/lots')
    .send(lot.toJSON())
    .loginVia(user.toJSON(), 'jwt')
    .end();

  assert.equal(lotResponse.body[0].message, 'Prices cannot be equal or less than zero');

  lotResponse.assertStatus(422);
});

test('POST 422 Lot can\'t be created with both current and estimated price string', async ({ assert, client }) => {

  const user = await createUser();
  const lot = await makeLot({
    estimatedPrice: '100$',
    currentPrice: 999,
  });

  const lotResponse = await client.post('/lots')
    .send(lot.toJSON())
    .loginVia(user.toJSON(), 'jwt')
    .end();

  assert.equal(lotResponse.body[0].message, 'number validation failed on estimatedPrice');

  lotResponse.assertStatus(422);
});

test('POST 200 Lot is created with pending status', async ({ assert, client }) => {

  const user = await createUser();
  const lot = await makeLot();

  const lotResponse = await client.post('/lots')
    .send(lot.toJSON())
    .loginVia(user.toJSON(), 'jwt')
    .end();

  const dbLot = await Lot.find(lotResponse.body.id);

  assert.equal(dbLot.status, 'pending');

  lotResponse.assertStatus(200);
});


test('GET 200 Lot can be gotten by id', async ({ assert, client }) => {

  const user = await createUser();
  const lot = await makeLot();

  const lotResponse = await client.post('/lots')
    .send(lot.toJSON())
    .loginVia(user.toJSON(), 'jwt')
    .end();

  const gottenById = await client.get(`/lots/${lotResponse.body.id}`)
    .loginVia(user.toJSON(), 'jwt')
    .end();

  assert.deepEqual(lotResponse.body, gottenById.body);

  gottenById.assertStatus(200);
});

test('DELETE 200 Lot can be deleted', async ({ assert, client }) => {

  const user = await createUser();
  const lot = await makeLot();

  const lotResponse = await client.post('/lots')
    .send(lot.toJSON())
    .loginVia(user.toJSON(), 'jwt')
    .end();

  const gottenById = await client.delete(`/lots/${lotResponse.body.id}`)
    .loginVia(user.toJSON(), 'jwt')
    .end();

  gottenById.assertStatus(200);
});


test('Deleted lot is deleted from database', async ({ assert, client }) => {

  const user = await createUser();
  const lot = await makeLot();

  const lotResponse = await client.post('/lots')
    .send(lot.toJSON())
    .loginVia(user.toJSON(), 'jwt')
    .end();

  const lotId = lotResponse.body.id

  await client.delete(`/lots/${lotId}`)
    .loginVia(user.toJSON(), 'jwt')
    .end();

  const lotFromDB = await Lot.find(lotId)

  assert.isNotOk(lotFromDB);
});

test('DELETE 404 User can delete only own lots', async ({ assert, client }) => {

  const user = await createUser();
  const unathorizedUser = await createUser();
  const lot = await makeLot();

  const lotResponse = await client.post('/lots')
    .send(lot.toJSON())
    .loginVia(user.toJSON(), 'jwt')
    .end();

  const lotId = lotResponse.body.id

  const response = await client.delete(`/lots/${lotId}`)
    .loginVia(unathorizedUser.toJSON(), 'jwt')
    .end();

  assert.equal(response.body.message,  'Lot not found' )

  response.assertStatus(404);
});


test('PUT 200 Lot can be updated', async ({ assert, client }) => {

  const user = await createUser();
  const lot = await makeLot()

  await client.post('/lots')
    .send(lot.toJSON())
    .loginVia(user.toJSON(), 'jwt')
    .end();


  const lotResponse = await client.post('/lots')
    .send(lot.toJSON())
    .loginVia(user.toJSON(), 'jwt')
    .end();

  lotResponse.assertStatus(200);
});

test('PUT 200 Lot can be updated', async ({ assert, client }) => {

  const user = await createUser();
  const lot = await makeLot()

  const newLotResponse = await client.post('/lots')
    .send(lot.toJSON())
    .loginVia(user.toJSON(), 'jwt')
    .end();

  const newTitle = 'I AM NEW TITLE';

  const lotResponse = await client.put(`/lots/${newLotResponse.body.id}`)
    .send({...lot.toJSON(), title: newTitle})
    .loginVia(user.toJSON(), 'jwt')
    .end();

  assert.equal(lotResponse.body.title,newTitle);
});

test('PUT 404 Lot can be updated only by its owner', async ({ assert, client }) => {

  const user = await createUser();
  const unathorizedUser = await createUser();
  const lot = await makeLot()

  const newLotResponse = await client.post('/lots')
    .send(lot.toJSON())
    .loginVia(user.toJSON(), 'jwt')
    .end();


  const newTitle = 'I AM NEW TITLE';

  const lotResponse = await client.put(`/lots/${newLotResponse.body.id}`)
    .send({...lot.toJSON(), title: newTitle})
    .loginVia(unathorizedUser.toJSON(), 'jwt')
    .end();

  assert.equal(lotResponse.body.message,  'Lot not found' )

  lotResponse.assertStatus(404);
});

test('PUT 403 Only pending lots can be updated', async ({ assert, client }) => {

  const user = await createUser();
  const lot = await makeLot()

  const {body : newLot} = await client.post('/lots')
    .send(lot.toJSON())
    .loginVia(user.toJSON(), 'jwt')
    .end();

  await Lot
    .query()
    .where('id', newLot.id)
    .update({ status: 'inProcess' })

  const newTitle = 'I AM NEW TITLE';

  const lotResponse = await client.put(`/lots/${newLot.id}`)
    .send({...lot.toJSON(), title: newTitle})
    .loginVia(user.toJSON(), 'jwt')
    .end();

  assert.equal(lotResponse.body.message,  `Only lots in "pending status" can be updated` )

  lotResponse.assertStatus(403);
});

test('PUT 403 Only pending lots can be deleted', async ({ assert, client }) => {

  const user = await createUser();
  const lot = await makeLot()

  const {body : newLot} = await client.post('/lots')
    .send(lot.toJSON())
    .loginVia(user.toJSON(), 'jwt')
    .end();

  await Lot
    .query()
    .where('id', newLot.id)
    .update({ status: 'inProcess' })

  const lotResponse = await client.delete(`/lots/${newLot.id}`)
    .loginVia(user.toJSON(), 'jwt')
    .end();

  assert.equal(lotResponse.body.message,  `Only lots in pending status can be deleted` )

  lotResponse.assertStatus(403);
});

test('After creating lot correct event is fired', async ({ assert, client }) => {

  const user = await createUser();
  const lot = await makeLot()

  Event.fake();

  const {body : newLot} = await client.post('/lots')
    .send(lot.toJSON())
    .loginVia(user.toJSON(), 'jwt')
    .end();

  const {event , data } = Event.recent();

  assert.equal(event,'lot::new');
  assert.deepEqual(data[0].toJSON(),newLot);

  Event.restore();
});

test('After updating lot correct event is fired', async ({ assert, client }) => {

  const user = await createUser();
  const lot = await makeLot()

  Event.fake();

  const newLotResponse = await client.post('/lots')
    .send(lot.toJSON())
    .loginVia(user.toJSON(), 'jwt')
    .end();

  const newTitle = 'I AM NEW TITLE';

  const lotResponse = await client.put(`/lots/${newLotResponse.body.id}`)
    .send({...lot.toJSON(), title: newTitle})
    .loginVia(user.toJSON(), 'jwt')
    .end();
  const {event , data } = Event.recent();

  assert.equal(event,'lot::update');
  assert.deepEqual(data[0].toJSON(),lotResponse.body);

  Event.restore();
});

test('After delete lot correct event is fired', async ({ assert, client }) => {

  const user = await createUser();
  const lot = await makeLot()

  Event.fake();

  const lotResponse = await client.post('/lots')
    .send(lot.toJSON())
    .loginVia(user.toJSON(), 'jwt')
    .end();

  await client.delete(`/lots/${lotResponse.body.id}`)
    .loginVia(user.toJSON(), 'jwt')
    .end();


  const {event , data } = Event.recent();

  assert.equal(event,'lot::delete');
  assert.deepEqual(JSON.stringify(data[0]),JSON.stringify(lotResponse.body)); // without .stringify does not work. Fucking adonis !!!

  Event.restore();
});


test('Lot manager saves lots correctly', async ({assert, client}) => {

  const user = await createUser();
  const lot = await makeLot()

  const {body: lotInfo} = await client.post('/lots')
    .send(lot.toJSON())
    .loginVia(user.toJSON(), 'jwt')
    .end();

  const savedLot = await LotManager.getLot(lotInfo.id);

  assert.deepEqual(savedLot,lotInfo);
});


test('Lot manager updates lots correctly', async ({ assert, client }) => {

  const user = await createUser();
  const lot = await makeLot()

  const newLotResponse = await client.post('/lots')
    .send(lot.toJSON())
    .loginVia(user.toJSON(), 'jwt')
    .end();

  const newTitle = 'I AM NEW TITLE';

  const {body: updatedLotInfo} = await client.put(`/lots/${newLotResponse.body.id}`)
    .send({...lot.toJSON(), title: newTitle})
    .loginVia(user.toJSON(), 'jwt')
    .end();

  const savedLot = await LotManager.getLot(updatedLotInfo.id);

  assert.deepEqual(savedLot,updatedLotInfo);
});

test('Lot manager deletes lots correctly', async ({ assert, client }) => {

  const user = await createUser();
  const lot = await makeLot()

  const {body} = await client.post('/lots')
    .send(lot.toJSON())
    .loginVia(user.toJSON(), 'jwt')
    .end();

  await client.delete(`/lots/${body.id}`)
    .loginVia(user.toJSON(), 'jwt')
    .end();

  const filePath = `${LotManager.fileManager.folderPath}/${body.id}`;

  assert.isNotOk(fs.existsSync(filePath),'File should not exist')
});

test('Lot becomes active', async ({ assert, client }) => {

  const user = await createUser();
  const lot = await makeLot({
    lotStartTime : moment(),
    lotEndTime : moment().add(1,'seconds'),
  })

  const {body} = await client.post('/lots')
    .send(lot.toJSON())
    .loginVia(user.toJSON(), 'jwt')
    .end();


  await waitFor(500)

  const activeLot = await client.get(`/lots/${body.id}`)
    .loginVia(user.toJSON(), 'jwt')
    .end();

  assert.equal(activeLot.body.status,'inProcess');

});

