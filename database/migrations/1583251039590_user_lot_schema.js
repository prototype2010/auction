'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class UserLotSchema extends Schema {
  up() {
    this.table('lots', (table) => {
      table
        .integer('user_id')
        .notNullable()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE');
    });
  }

  down() {
    this.table('lots', (table) => {
      table.dropColumn('lots');
    });
  }
}

module.exports = UserLotSchema;
