const moment = require('moment');

const validLotDates = async (data, field, message, args, get) => {
  const lotStartTime = get(data, 'lotStartTime');
  const lotEndTime = get(data, 'lotEndTime');

  if (moment(lotEndTime).isBefore(moment(lotStartTime))) {
    throw new Error('Auction can\'t end before it starts');
  } else if (moment(lotEndTime).isBefore(moment(lotStartTime).add(1, 'hour'))) {
    throw new Error('Auction can\'t last less than an hour ');
  } else if (moment(lotStartTime).isBefore(moment().add(1, 'minute'))) { /* 1 minute as maximum processing time */
    throw new Error('Auction can\'t be started in the past');
  }
};

module.exports = { validLotDates };
