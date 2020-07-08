'use strict';

const { BaseValidator } = require('./BaseValidator');

class LotStore extends BaseValidator {
  get rules() {
    // console.log("######", this.context.params)

    return {
      title: 'required',
      description: 'string',
      image: 'required_when:file|file_size:5mb|file_types:image',
      currentPrice: 'required|number',
      estimatedPrice: 'required|number|validLotPrices',
      lotStartTime: 'required|date',
      lotEndTime: 'required|date|validLotDates',
    };
  }
}

module.exports = LotStore;
