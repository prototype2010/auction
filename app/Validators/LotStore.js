'use strict';

const { BaseValidator } = require('./BaseValidator');

class LotStore extends BaseValidator {
  get rules() {
    return {
      title: 'required',
      status: 'required',
      currentPrice: 'required|number',
      estimatedPrice: 'required|number',
      lotStartTime: 'required|date',
      lotEndTime: 'required|date',
    };
  }
}

module.exports = LotStore;
