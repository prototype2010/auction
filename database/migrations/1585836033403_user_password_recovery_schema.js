'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class UserPasswordRecoverySchema extends Schema {
  up() {
    this.table('users', (table) => {
      table.string('passwordRecoveryToken', 100);
      table.datetime('tokenExpirationDate');
      table.boolean('isPasswordUpdateAllowed').defaultTo(false);
    });
  }

  down() {
    this.table('users', (table) => {
      table.dropColumn('passwordRecoveryToken');
      table.dropColumn('tokenExpirationDate');
      table.boolean('isPasswordUpdateAllowed');
    });
  }
}

module.exports = UserPasswordRecoverySchema;
