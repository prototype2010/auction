/* eslint-disable */
const Bull = require('bull');
const Lot = use('App/Models/Lot');

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

  if(lot) {
    lot.status = 'inProcess';
    await lot.save();
  }

  job.progress(100);
  return true;
});

NewLotsQueue.on('completed', job => {
  // Event.fire('lot::delete', job.data); // TODO probably WS event here
});


module.exports = {
  NewLotsQueue
};
