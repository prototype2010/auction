'use strict';

const { BaseValidator } = require('./BaseValidator');

class OrderStore extends BaseValidator {
  get rules() {
    return {
      lotId: 'required|number|lotExists|lotClosed',
      arrivalLocation: 'required|string|validArrivalLocation',
      arrivalType: 'required|string|validArrivalType',
    };
  }
}

module.exports = OrderStore;
