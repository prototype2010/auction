const moment = require('moment');

const validLotDates = async (data, field, message, args, get) => {
  const lotStartTime = get(data, 'lotStartTime');
  const lotEndTime = get(data, 'lotEndTime');

  if (moment(lotEndTime).isBefore(moment(lotStartTime))) {
    throw new Error('Auction can\'t end before it starts');
  }

  if (moment(lotEndTime).isBefore(moment(lotStartTime).add(1, 'hour'))) {
    throw new Error('Auction can\'t last less than an hour ');
  }

  if (moment(lotStartTime).isBefore(moment().add(1, 'minute'))) { /* 1 minute as maximum processing time */
    throw new Error('Auction can\'t be started in the past');
  }
};

const validLotPrices = async (data, field, message, args, get) => {
  const currentPrice = +get(data, 'currentPrice');
  const estimatedPrice = +get(data, 'estimatedPrice');

  if (estimatedPrice < 0) {
    throw new Error('Estimated price cannot be equal to zero');
  }

  if (estimatedPrice < currentPrice) {
    throw new Error('Estimated price cannot be lower than current price');
  }

  return true;
};

module.exports = { validLotDates, validLotPrices };
