const Order = use('App/Models/Order');
const Lot = use('App/Models/Lot');

class OrderController {
  async index({ request, auth }) {
    const { id } = await auth.getUser();
    const page = request.get().page || 1;

    return Order
      .query()
      .where('owner_id', '=', id)
      .orWhere('user_id', '=', id)
      .paginate(page);
  }

  async store({ request, auth }) {
    const {
      lotId,
      arrivalLocation,
      arrivalType,
    } = request.only([
      'lotId',
      'arrivalLocation',
      'arrivalType',
    ]);
    const { id: userId } = await auth.getUser();

    await Lot.findByOrFail({ id: lotId, winner_id: userId, status: 'closed' });

    const order = new Order();

    order.status = 'pending';
    order.user_id = userId;
    order.lot_id = lotId;
    order.arrival_location = arrivalLocation;
    order.arrival_type = arrivalType;

    await order.save();

    return order;
  }


  async show({ request, auth }) {
    const { id } = request.only([
      'id',
    ]);

    const { id: userId } = await auth.getUser();

    const order = await Order.findByOrFail({ id });
    const lot = await Lot.findByOrFail({ id: order.lot_id });

    if (lot.user_id === userId || order.user_id === userId) {
      return order;
    }

    request.status(403).message('You cannot see someones\' order');
  }
  /**
   * Render a form to update an existing order.
   * GET orders/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  // async edit ({ params, request, response, view }) {}
  /**
   * Update order details.
   * PUT or PATCH orders/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  // async update ({ params, request, response }) {}
  /**
   * Delete a order with id.
   * DELETE orders/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  // async destroy ({ params, request, response }) {}
}

module.exports = OrderController;
