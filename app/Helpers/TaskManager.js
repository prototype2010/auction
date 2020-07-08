/* eslint-disable */
const Bull = require('bull');
const moment = require('moment');
const Lot = use('App/Models/Lot');
const TimeUtils = use('TimeUtils');

const NewLotsQueue = new Bull('lots', {
  limiter: {
    max: 100,
    duration: 1000,
  },
});

NewLotsQueue.process(async job => {

  const { data } = job

  const lot = await Lot.find(data.id);

  if(lot && (moment().isAfter(lot.lotStartTime) || moment().isSame(moment(lot.lotStartTime)) )) {
    lot.status = 'inProcess';
    await lot.save();
  } else if(lot && moment(lot.lotStartTime).isAfter(moment())) {
    const newTaskDelay = TimeUtils.getDiffMillisecondsFromNow(lot.lotStartTime)
    NewLotsQueue.add(lot, { delay: newTaskDelay });
  }

  job.progress(100);

  return true;
});

NewLotsQueue.on('completed', async job => {

  const lot = await Lot.find(job.data.id);

  if(lot && lot.status === 'inProcess') {

  }
});




module.exports = {
  NewLotsQueue
};
