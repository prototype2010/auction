/* eslint-disable */
const Lot = use('App/Models/Lot');
const Database = use('Database');
const Helpers = use('Helpers')
const uid = require('uid');
const Event = use('Event');

class LotController {

  async index({request}) {

    const page = request.get().page || 1
    return Lot
      .query()
      .where('status', '!=', 'pending')
      .paginate(page);
  }

  async store({ request, response, auth }) {
    const {
      title,
      currentPrice,
      estimatedPrice,
      startTime,
      endTime,
      description
    } = request.only([
      'title',
      'currentPrice',
      'description',
      'estimatedPrice',
      'startTime',
      'endTime',
    ]);

    const image = await this.saveImageIfAttached(request);
    const user = await auth.getUser();
    const lot = new Lot();

    lot.user_id = user.id;
    lot.description = description;
    lot.title = title;
    lot.currentPrice = currentPrice;
    lot.estimatedPrice = estimatedPrice;
    lot.startTime = startTime;
    lot.endTime = endTime;
    lot.image = image;
    lot.status = 'pending';

    await lot.save();

    Event.fire('lot::new', lot);

    return Lot.find(lot.id);
  }


  /**
   * Display a single user.
   * GET users/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */

  async show({ params, auth, response }) {
    const { id } = params;

    const authUser = await auth.getUser();

    return Lot.findBy({
      id,
      user_id: authUser.id
    });
  }


  async update({ params, request, response, auth }) {
    const {
      title,
      currentPrice,
      estimatedPrice,
      startTime,
      endTime,
      description
    } = request.only([
      'title',
      'currentPrice',
      'description',
      'estimatedPrice',
      'startTime',
      'endTime',
    ]);

    const { id : userId} = await auth.getUser();

    const lot = await Lot.findByOrFail({
      user_id: userId,
      id: params.id,
    });

    if(lot.status === 'pending') {

      lot.image = await this.saveImageIfAttached(request);
      lot.status = 'pending';
      lot.title = title;
      lot.description = description;
      lot.currentPrice = currentPrice;
      lot.estimatedPrice = estimatedPrice;
      lot.startTime = startTime;
      lot.endTime = endTime;

      await lot.save();

      Event.fire('lot::update', lot);

      return lot;

    } else if (lot.status !== 'pending') {
      response
        .status(403)
        .send({
        message: `Only lots in "pending status" can be updated`
      });
    }
  }

  async saveImageIfAttached(request) {
    const lotImage = request.file('image', {
      types: ['image'],
      size: '2mb'
    })

    if(lotImage) {
      const imageName = `${uid(16)}.${lotImage.extname}`

      await lotImage.move(Helpers.tmpPath('uploads'), {
        name: imageName,
        overwrite: true
      });

      if (!lotImage.moved()) {
        return lotImage.error()
      }

      return imageName;
    } else {
      return null;
    }
  }

  async destroy ({ params, auth, response }) {
    const { id : userId} = await auth.getUser();

    const lot = await Lot.findByOrFail({
      user_id: userId,
      id: params.id,
    });

    if(lot.status !== 'pending' ) {
      response
        .status(403)
        .send({
          message: `Only lots in pending status can be deleted`
        });
    } else {
      await lot.delete();

      Event.fire('lot::delete', lot);

      response
        .status(200)
        .send({
          message: 'ok'
        });
    }
  }

  async myLots({auth, response, request}) {

    const page = request.get().page || 1
    const {id} = await auth.getUser();

    const myBidedLots = await Database
      .select('lot_id')
      .from('bids')
      .where({user_id: id})


    return Lot
      .query()
      .where('user_id', '=', id)
      .orWhereIn('id', myBidedLots.map(({lot_id}) => lot_id))
      .paginate(page)
  }
}

module.exports = LotController;
