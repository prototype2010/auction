/* eslint-disable */
const Bull = require('bull');
const moment = require('moment');
const Lot = use('App/Models/Lot');
const TimeUtils = use('TimeUtils');

const LotsQueue = new Bull('lots', {
  limiter: {
    max: 100,
    duration: 1000,
  },
});

LotsQueue.process(async job => {

  const { data } = job

  const lot = await Lot.find(data.id);


  if(lot) {
    if((moment().isAfter(lot.startTime) || moment().isSame(moment(lot.startTime)) )) {
      lot.status = 'inProcess';
      await lot.save();
      const lotEndTimeTask = TimeUtils.getDiffMillisecondsFromNow(lot.endTime)
      LotsQueue.add(lot, { delay: lotEndTimeTask });
    } else if(moment(lot.startTime).isAfter(moment())) {
      // restart lot on update
      const newStartTime = TimeUtils.getDiffMillisecondsFromNow(lot.startTime)
      LotsQueue.add(lot, { delay: newStartTime });
    } else if(moment(lot.endTime).isAfter(moment()) || moment().isSame(moment(lot.endTime)) ) {
      // close lot by time
      lot.status = 'closed';
      await lot.save();
      Event.fire('lot::closedByTime', lot);
    }
  }



  job.progress(100);

  return true;
});

LotsQueue.on('completed', async job => {

  // const lot = await Lot.find(job.data.id);
  //
  // if(lot && lot.status === 'inProcess') {
  //
  // }
});

module.exports = {
  LotsQueue
};
