'use strict';

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class Bid extends Model {
  static get createdAtColumn() {
    return 'created_at';
  }

  static get updatedAtColumn() {
    return 'updated_at';
  }

  lot() {
    return this.belongsTo('App/Models/Lot');
  }

  user() {
    return this.belongsTo('App/Models/User');
  }
}

module.exports = Bid;
