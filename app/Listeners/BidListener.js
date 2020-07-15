const { BidsQueue } = use('BidsManager');

class BidListener {
  static BID_NEW = 'bid::new';

  static async bidAdd(bid) {
    BidsQueue.add(bid, { delay: 0 });
  }
}

module.exports = BidListener;
