'use strict';

/*
|--------------------------------------------------------------------------
| Factory
|--------------------------------------------------------------------------
|
| Factories are used to define blueprints for database tables or Lucid
| models. Later you can use these blueprints to seed your database
| with dummy data.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory');
const Faker = require('faker');
const moment = require('moment');

Factory.blueprint('App/Models/Lot', () => {
  const price = Math.ceil(Math.random() * 1000);

  return {
    title: Faker.lorem.words(),
    image: Faker.image.imageUrl(),
    description: Faker.lorem.sentence(),
    status: 'pending',
    currentPrice: price,
    estimatedPrice: price * 2,
    lotStartTime: new Date().toISOString(),
    lotEndTime: new Date(Date.now() + 999999).toISOString(),
  };
});

Factory.blueprint('App/Models/User', async () => ({
  password: Faker.internet.password(),
  email: Faker.internet.email(),
  firstname: Faker.name.firstName(),
  lastname: Faker.name.lastName(),
  birthday: moment()
    .subtract(30, 'years')
    .toISOString(),
  phone: Faker.phone.phoneNumber(),
}));

Factory.blueprint('App/Models/Bid', async () => ({}));
