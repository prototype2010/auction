/* eslint-disable */
const Bull = require('bull');
const Event = use('Event');
const Lot = use('App/Models/Lot');
const {LOT_EVENTS} = use('App/Listeners/LotListener');


const BidsQueue = new Bull('bids', {
  limiter: {
    max: 100,
    duration: 1000,
  },
});

BidsQueue.process(async job => {

  const { proposed_price, lot_id, user_id} = job.data

  const lot = await Lot.findBy({id: Number(lot_id)});

  if(lot && lot.status === 'inProcess') {

    if(Number(proposed_price) > lot.currentPrice) {
      lot.currentPrice = proposed_price;
    }

    if(Number(proposed_price) >= lot.estimatedPrice) {
      lot.status = 'closed';
      lot.winner_id = user_id;

      Event.fire(LOT_EVENTS.LOT_CLOSE, lot);
    }

    await lot.save();
  }

  job.progress(100);

  return true;
});

BidsQueue.on('completed', async job => {
  const { data } = job

});

module.exports = {
  BidsQueue
};
