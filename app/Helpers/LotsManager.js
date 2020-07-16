/* eslint-disable */
const Bull = require('bull');
const Lot = use('App/Models/Lot');
const { getDiffMillisecondsFromNow, shouldBeStartedNow, shouldBeRestartedNow, shouldBeClosedByTime } = use('TimeUtils');
const Bid = use('App/Models/Bid');
const {LOT_EVENTS} = use('App/Listeners/LotListener');

const LotsQueue = new Bull('lots');

LotsQueue.process(async job => {

  const { data } = job

  const lot = await Lot.find(data.id);


  if(lot) {
    if(shouldBeStartedNow(lot)) {
      lot.status = 'inProcess';
      await lot.save();
      const lotEndTimeTask = getDiffMillisecondsFromNow(lot.endTime)
      LotsQueue.add(lot, { delay: lotEndTimeTask });
    }

    if(shouldBeRestartedNow(lot)) {
      const newStartTime = getDiffMillisecondsFromNow(lot.startTime)
      LotsQueue.add(lot, { delay: newStartTime });
    }

    if(shouldBeClosedByTime(lot)) {
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
      Event.fire(LOT_EVENTS.LOT_CLOSE, lot);
    }
  }


  job.progress(100);

  return true;
});

module.exports = {
  LotsQueue
};
