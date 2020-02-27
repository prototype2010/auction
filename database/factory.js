'use strict'

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
const Factory = use('Factory')
const Hash = use('Hash')
const Faker = require('faker');

Factory.blueprint('App/Models/Lot', (faker) => {
  return {
    name: faker.name()
  }
})

Factory.blueprint('App/Models/User',async () => {
  return {
    password: await Hash.make(Faker.internet.password()),
    email:Faker.internet.email(),
    firstname : Faker.name.firstName(),
    lastname: Faker.name.lastName(),
    birthday: Faker.date.past(),
    phone: Faker.phone.phoneNumber(),
  }
});
