'use strict'
const Lot = use('App/Models/Lot')


class LotController {
  async index() {
    const all = await Lot.all();

    return all;
  }
}

module.exports = LotController
