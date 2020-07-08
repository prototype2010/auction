
const Bid = use('App/Models/Bid');
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with bids
 */
class BidController {
  async index({ auth, request }) {
    const page = request.get().page || 1;
    const { id } = await auth.getUser();

    return Bid
      .query()
      .where('user_id', '=', id)
      .paginate(page);
  }

  async store({ request, auth }) {
    const {
      lodId,
      proposedPrice,
    } = request.only([
      'lodId',
      'proposedPrice',
    ]);

    const { id } = await auth.getUser();

    const bid = new Bid();

    bid.user_id = id;
    bid.proposedPrice = proposedPrice;
    bid.lot_id = lodId;

    bid.save();

    return bid;
  }

  async show({ params }) {
    const { id } = params;

    return Bid.findByOrFail({ id });
  }

  async update({ params, request, auth }) {
    const { proposedPrice } = request.only([
      'lodId',
      'proposedPrice',
    ]);

    const { id: userId } = await auth.getUser();
    const { id: bidId } = params;

    const bid = Bid.findBy({ id: bidId, user_id: userId });

    bid.proposedPrice = proposedPrice;

    bid.save();

    return bid;
  }
  /**
   * Delete a bid with id.
   * DELETE bids/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  // async destroy ({ params, request, response }) {}
}

module.exports = BidController;
