/* eslint-disable */
const Lot = use('App/Models/Lot');

class LotController {
  async store({ request, response, auth }) {
    const {
      title,
      currentPrice,
      estimatedPrice,
      lotStartTime,
      lotStartEnd,
    } = request.only([
      'title',
      'currentPrice',
      'estimatedPrice',
      'lotStartTime',
      'lotStartEnd',
    ]);


    return true;
  }

  async index() {
    const all = await Lot.all();

    return all;
  }
}

module.exports = LotController;
