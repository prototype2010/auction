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
const Hash = use('Hash');
const Faker = require('faker');

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
  password: await Hash.make(Faker.internet.password()),
  email: Faker.internet.email(),
  firstname: Faker.name.firstName(),
  lastname: Faker.name.lastName(),
  birthday: Faker.date.past(),
  phone: Faker.phone.phoneNumber(),
}));

Factory.blueprint('App/Models/Bid', async () => ({}));
    name: faker.name()
  }
});
