'use strict';

const { BaseValidator } = require('./BaseValidator');

class BidStore extends BaseValidator {
  get rules() {
    return {
      lodId: 'required|number|lotExists|lotInProcess',
      proposedPrice: 'required|number|validBidPrice',
    };
  }
}

module.exports = BidStore;
