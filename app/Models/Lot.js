'use strict';

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class Lot extends Model {
  static get table() {
    return 'lots';
  }

  static get createdAtColumn() {
    return 'created_at';
  }

  static get updatedAtColumn() {
    return 'updated_at';
  }

  user() {
    return this.belongsTo('App/Models/User');
  }

  bids() {
    return this.hasMany('App/Models/Bid');
  }
}

module.exports = Lot;
