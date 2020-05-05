const moment = require('moment');

const getDiffMillisecondsFromNow = date => {
  const diff = (moment(date).diff(moment(), 'milliseconds'));
  return diff < 0 ? 0 : diff;
};

module.exports = { getDiffMillisecondsFromNow };
