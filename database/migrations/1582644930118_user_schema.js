'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UserSchema extends Schema {
  up () {
    this.alter('users', (table) => {


      table.string('firstname', 80).notNullable().unique()
      table.string('lastname', 80).notNullable().unique()
      table.timestamp('birthday', 80).notNullable().unique()
      table.string('phone', 12).notNullable().unique()
    })
  }

  down () {
      this.drop('users')
  }
}

module.exports = UserSchema;
