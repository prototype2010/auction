'use strict';

const { BaseValidator } = require('./BaseValidator');

class OrderStore extends BaseValidator {
  get rules() {
    return {
      lotId: 'required|number|lotExists|lotInProcess',
      arrivalLocation: 'required|string',
      arrivalType: 'required|string',
    };
  }
}

module.exports = OrderStore;
