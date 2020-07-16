'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class LotsSchema extends Schema {
  up() {
    this.create('lots', table => {
      table.increments();
      table.string('title', 200);
      table.string('image', 200).defaultTo(null);
      table.text('description', 400);
      table
        .enu('status', ['pending', 'inProcess', 'closed'])
        .defaultTo('pending');
      table.float('currentPrice', { precision: 2 });
      table.float('estimatedPrice', { precision: 2 });
      table.timestamp('startTime');
      table.timestamp('endTime');
      table
        .integer('winner_id')
        .defaultTo(null)
        .references('id')
        .inTable('users')
        .onDelete('CASCADE');
      table.timestamps();
    });
  }

  down() {
    this.drop('lots');
  }
}

module.exports = LotsSchema;
