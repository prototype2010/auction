const moment = require('moment');

const validLotDates = async (data, field, message, args, get) => {
  const startTime = get(data, 'startTime');
  const lotEndTime = get(data, 'endTime');

  if (moment(lotEndTime).isBefore(moment(startTime))) {
    throw new Error('Auction can\'t end before it starts');
  }

  if (process.env.NODE_ENV !== 'testing' /* for testing purposes we wont wait for an hour */
    && moment(lotEndTime).isBefore(moment(startTime).add(1, 'hour'))) {
    throw new Error('Auction can\'t last less than an hour ');
  }

  if (moment(startTime).add(1, 'minute').isBefore(moment())) { /* 1 minute as maximum processing time */
    throw new Error('Auction can\'t be started in the past');
  }
};

const validLotPrices = async (data, field, message, args, get) => {
  const currentPrice = +get(data, 'currentPrice');
  const estimatedPrice = +get(data, 'estimatedPrice');

  if ((estimatedPrice <= 0) || (currentPrice <= 0)) {
    throw new Error('Prices cannot be equal or less than zero');
  }

  if (estimatedPrice < currentPrice) {
    throw new Error('Estimated price cannot be lower than current price');
  }

  return true;
};

module.exports = { validLotDates, validLotPrices };
