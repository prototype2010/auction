'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class LotsSchema extends Schema {
  up() {
    this.create('lots', (table) => {
      table.increments();
      table.string('name', 80).notNullable();
      table.timestamps();
    });
  }

  down() {
    this.drop('lots');
  }
}

module.exports = LotsSchema;
