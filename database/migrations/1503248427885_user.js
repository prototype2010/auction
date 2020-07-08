'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class UserSchema extends Schema {
  up() {
    this.create('users', (table) => {
      table.increments();
      table
        .string('email', 254)
        .notNullable()
        .unique();
      table
        .string('phone', 40)
        .notNullable()
        .unique();
      table.string('password', 60).notNullable();
      table.string('firstname', 80).notNullable();
      table.string('lastname', 80).notNullable();
      table.timestamp('birthday', 80).notNullable();
      table.timestamps();
    });
  }

  down() {
    this.drop('users');
  }
}

module.exports = UserSchema;
