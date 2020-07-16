const { BidsQueue } = use('BidsManager');

class BidListener {
  static async bidAdd(bid) {
    BidsQueue.add(bid, { delay: 0 });
  }
}

const BID_EVENTS = { BID_NEW: 'bid::new' };

module.exports = { BidListener, BID_EVENTS };
