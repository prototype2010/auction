'use strict';

const { BaseValidator } = require('./BaseValidator');

class BidStore extends BaseValidator {
  get rules() {
    return {
      lotId: 'required|number|lotExists|lotInProcess',
      proposedPrice: 'required|number|validBidPrice|moreThanLotCurrentPrice',
    };
  }
}

module.exports = BidStore;
