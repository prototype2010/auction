/* eslint-disable */
const Bull = require('bull');
const moment = require('moment');
const Bid = use('App/Models/Bid');
const TimeUtils = use('TimeUtils');

const BidsQueue = new Bull('bids', {
  limiter: {
    max: 100,
    duration: 1000,
  },
});

BidsQueue.process(async job => {

  const { lot_id, id, proposer_price } = job.data

  const bid = await Bid.findBy({id});

  if(bid && proposer_price > bid.proposed_price) {
    bid.proposer_price = proposer_price;

    await bid.save();
    console.log('price increaced to ', proposer_price);
  }

  job.progress(100);

  return true;
});

BidsQueue.on('completed', async job => {

  const { data } = job

// TODO NOTIFY BID RAISE HERE
});

module.exports = {
  BidsQueue
};
