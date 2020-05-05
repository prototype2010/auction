/* eslint-disable */
const Bull = require('bull');
const moment = require('moment');
const Lot = use('App/Models/Lot');
const LotManager = use('LotManager');
const TimeUtils = use('TimeUtils');

const Event = use('Event');

const NewLotsQueue = new Bull('lots', {
  limiter: {
    max: 100,
    duration: 1000,
  },
});

NewLotsQueue.process(async job => {

  const { data } = job

  const lot = await Lot.find(data.id);
  // const startTime = lot.lotStartTime;

  if(!lot) {
    // lot deleted cancel task // todo maybe delete backup files
  } else if(lot && (moment().isAfter(lot.lotStartTime) || moment().isSame(moment(lot.lotStartTime)) )) {
    // make active
    lot.status = 'inProcess';
    await lot.save();
  } else if(lot && moment(lot.lotStartTime).isAfter(moment())) {
    // create new task
    const newTaskDelay = TimeUtils.getDiffMillisecondsFromNow(lot.lotStartTime)
    NewLotsQueue.add(lot, { delay: newTaskDelay });
  }

  job.progress(100);

  return true;
});

NewLotsQueue.on('completed', async job => {

  const lot = await Lot.find(job.data.id);

  if(lot && lot.status === 'inProcess') {
    LotManager.deleteLot(lot.id)
  }
});




module.exports = {
  NewLotsQueue
};
