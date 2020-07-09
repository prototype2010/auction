
const Bid = use('App/Models/Bid');
const Lot = use('App/Models/Lot');
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
      lotId,
      proposedPrice,
    } = request.only([
      'lotId',
      'proposedPrice',
    ]);

    const { id } = await auth.getUser();

    const bid = new Bid();

    bid.user_id = id;
    bid.proposed_price = proposedPrice;
    bid.lot_id = lotId;

    await bid.save();

    return bid;
  }

  async show({ params }) {
    const { id } = params;

    return Bid.findByOrFail({ id });
  }

  async update({ params, request, auth }) {
    const { proposedPrice } = request.only([
      'lotId',
      'proposedPrice',
    ]);

    const { id: userId } = await auth.getUser();
    const { id: bidId } = params;

    const bid = await Bid.findBy({ id: bidId, user_id: userId });

    bid.proposed_price = proposedPrice;

    await bid.save();

    return bid;
  }

  async destroy({ params, auth, response }) {
    const { id: userId } = await auth.getUser();
    const { id: bidId } = params;

    const bid = await Bid.findByOrFail({ user_id: userId, id: +bidId });

    const lot = await Lot.findByOrFail({ id: bid.lot_id });

    if (lot.status !== 'inProcess') {
      response.status(403).send({ message: 'Only bid for lot with "inProcess" status can be deleted' });
    } else {
      await bid.delete();

      return bid;
    }
  }
}

module.exports = BidController;
