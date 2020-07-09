/* eslint-disable */
const Bull = require('bull');
const Bid = use('App/Models/Bid');

const BidsQueue = new Bull('bids', {
  limiter: {
    max: 100,
    duration: 1000,
  },
});

BidsQueue.process(async job => {

  const { id, proposer_price } = job.data

  const bid = await Bid.findBy({id});

  if(bid && proposer_price > bid.proposed_price) {
    bid.proposer_price = proposer_price;

    await bid.save();
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
