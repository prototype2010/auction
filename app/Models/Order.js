'use strict';

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class Order extends Model {
  static get createdAtColumn() {
    return 'created_at';
  }

  static get updatedAtColumn() {
    return 'updated_at';
  }

  user() {
    return this.belongsTo('App/Models/User');
  }

  lot() {
    return this.belongsTo('App/Models/Lot');
  }
}

module.exports = Order;
