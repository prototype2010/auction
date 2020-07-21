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


  async show({ request, auth, params }) {
    const { id } = params;

    const { id: userId } = await auth.getUser();

    const order = await Order.findByOrFail({ id });
    const lot = await Lot.findByOrFail({ id: order.lot_id });

    if (lot.user_id === userId || order.user_id === userId) {
      return order;
    }

    request.status(404).message('Not found');
  }

  async update({ params, request, auth }) {
    const { id } = params;

    const { arrivalLocation, arrivalType } = request.only([
      'arrivalLocation',
      'arrivalType',
    ]);

    const { id: userId } = await auth.getUser();

    const order = await Order.findByOrFail({ id, user_id: userId });

    if (order.status === 'pending') {
      order.arrival_location = arrivalLocation;
      order.arrival_type = arrivalType;

      await order.save();

      return order;
    }

    request.status(403).message(`You can't update order in ${order.status} status`);
  }

  async approveSent({ params, request, auth }) {
    const { id } = params;

    const { id: userId } = await auth.getUser();

    const order = await Order.findByOrFail({ id });
    // const user = await order.user();

    if (order.status === 'pending') {
      if (order.user_id === userId) {
        order.status = 'sent';

        await order.save();

        return order;
      }

      request.status(403).message('Cannot approve someone\'s orders');
    }

    request.status(403).message(`Cannot approve order in status ${order.status} status`);
  }

  async approveDelivered({ params, request, auth }) {
    const { id } = params;

    const { id: userId } = await auth.getUser();

    const order = await Order.findByOrFail({ id });

    if (order.status === 'sent') {
      if (order.user_id === userId) {
        order.status = 'delivered';

        await order.save();

        return order;
      }

      request.status(403).message('Cannot approve someone\'s orders');
    }

    request.status(403).message(`Cannot approve order in status ${order.status} status`);
  }

  async destroy({ params, request, auth }) {
    const { id } = params;

    const { id: userId } = await auth.getUser();

    const order = await Order.findByOrFail({ id, user_id: userId });

    if (order.status === 'pending') {
      await order.delete();

      return order;
    }

    request.status(403).message(`You can't delete order in ${order.status} status`);
  }
}

module.exports = OrderController;
