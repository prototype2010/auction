/* eslint-disable */
const Lot = use('App/Models/Lot');
const Helpers = use('Helpers')
const uid = require('uid');

class LotController {

  async index() {
    const all = await Lot.all();

    return all;
  }

  async store({ request, response, auth }) {
    const {
      title,
      currentPrice,
      estimatedPrice,
      lotStartTime,
      lotEndTime,
    } = request.only([
      'title',
      'currentPrice',
      'estimatedPrice',
      'lotStartTime',
      'lotEndTime',
    ]);

    const image = await this.saveImageIfAttached(request);

    const user = await auth.getUser();

    const lot = await Lot.create({
      title,
      currentPrice,
      estimatedPrice,
      lotStartTime,
      lotEndTime,
      user_id: user.id,
      image,
  })

     await user.lots().save(lot);

    return lot.toJSON();
  }


  async update({ params, request, response, auth }) {
    const {
      title,
      currentPrice,
      estimatedPrice,
      lotStartTime,
      lotEndTime,
    } = request.only([
      'title',
      'currentPrice',
      'estimatedPrice',
      'lotStartTime',
      'lotEndTime',
    ]);

    const { id : userId} = await auth.getUser();

    const lot = await Lot.findBy({
      user_id: userId,
      id: params.id,
    });

    if(lot && lot.status === 'pending') {

      const image = await this.saveImageIfAttached(request);

      lot.image = image;
      lot.title = title;
      lot.currentPrice = currentPrice;
      lot.estimatedPrice = estimatedPrice;
      lot.lotStartTime = lotStartTime;
      lot.lotEndTime = lotEndTime;

      await lot.save();

      return lot;


    } else if (lot.status !== 'pending') {
      response
        .status(403)
        .send({
        message: `Only lots in "pending status" can be updated`
      });


    } else {
      response
        .status(404)
        .send({
        message: `Lot not found`
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
}

module.exports = LotController;
