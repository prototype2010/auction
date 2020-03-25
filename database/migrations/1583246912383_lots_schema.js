'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class LotsSchema extends Schema {
  up() {
    this.table('lots', table => {
      table.string('title', 200);
      table.string('image', 200);
      table.text('description', 400);
      table.enu('status', ['pending', 'inProcess', 'closed']).defaultTo('pending');
      table.float('currentPrice', { precision: 2 });
      table.float('estimatedPrice', { precision: 2 });
      table.timestamp('lotStartTime');
      table.timestamp('lotEndTime');
    });
  }

  down() {
    this.dropTable('lots');
  }
}

module.exports = LotsSchema;
