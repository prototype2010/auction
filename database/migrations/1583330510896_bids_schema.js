'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class BidsSchema extends Schema {
  up() {
    this.create('bids', (table) => {
      table.increments();
      table.float('proposedPrice').notNullable();
      table
        .integer('user_id')
        .notNullable()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE');
      table
        .integer('lot_id')
        .notNullable()
        .references('id')
        .inTable('lots')
        .onDelete('CASCADE');
      table.timestamps();
    });
  }

  down() {
    this.drop('bids');
  }
}

module.exports = BidsSchema;
