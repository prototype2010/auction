/* eslint-disable */
const Bull = require('bull');
const moment = require('moment');
const Lot = use('App/Models/Lot');
const TimeUtils = use('TimeUtils');
const Bid = use('App/Models/Bid');

const LotsQueue = new Bull('lots');

LotsQueue.process(async job => {

  const { data } = job

  const lot = await Lot.find(data.id);


  if(lot) {
    if((moment().isAfter(lot.startTime) || moment().isSame(moment(lot.startTime)) ) && lot.status === 'pending' ) {
      //start lot
      lot.status = 'inProcess';
      await lot.save();
      const lotEndTimeTask = TimeUtils.getDiffMillisecondsFromNow(lot.endTime)
      LotsQueue.add(lot, { delay: lotEndTimeTask });
    }

    if((moment(lot.startTime).isAfter(moment())) && lot.status === 'pending') {
      // restart task on update
      const newStartTime = TimeUtils.getDiffMillisecondsFromNow(lot.startTime)
      LotsQueue.add(lot, { delay: newStartTime });
    }

    if(moment(lot.endTime).isBefore(moment()) || moment().isSame(moment(lot.endTime)) ) {
      // close lot by time
      lot.status = 'closed';

      const topBid = await Bid
        .query()
        .where({lot_id: lot.id})
        .orderBy('proposed_price', 'desc')
        .orderBy('created_at', 'asc')
        .first()

      if(topBid) {
        lot.winner_id = topBid.user_id;
        await lot.save();

      }

      await lot.save();
      Event.fire('lot::closed', lot);
    }
  }


  job.progress(100);

  return true;
});

module.exports = {
  LotsQueue
};
