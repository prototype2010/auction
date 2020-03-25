'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class LotSchema extends Schema {
  up() {
    this.table('lots', table => {
      table.dropColumn('name');
    });
  }

  down() {
    this.table('lots', table => {
      table.string('name');
    });
  }
}

module.exports = LotSchema;
