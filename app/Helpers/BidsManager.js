/* eslint-disable */
const Bull = require('bull');
const moment = require('moment');
const Bid = use('App/Models/Bid');
const TimeUtils = use('TimeUtils');

const BidsQueue = new Bull('lots', {
  limiter: {
    max: 100,
    duration: 1000,
  },
});

BidsQueue.process(async job => {

  const { data } = job

  console.log('incoming bull job' , data);

  job.progress(100);

  return true;
});

BidsQueue.on('completed', async job => {



  console.log('bids queu completed' , data);

});

module.exports = {
  BidsQueue
};
