'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class OrderSchema extends Schema {
  up() {
    this.create('orders', (table) => {
      table.increments();
      table.text('arrivalLocation').notNullable();
      table.enu('arrivalType', [
        'Royal Mail',
        'United States Postal Service',
        'DHL Express',
      ]);
      table.enu('status', ['pending', 'sent', 'delivered']);
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
    this.drop('orders');
  }
}

module.exports = OrderSchema;
