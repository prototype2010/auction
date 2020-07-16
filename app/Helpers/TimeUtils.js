const moment = require('moment');

const getDiffMillisecondsFromNow = date => {
  const diff = (moment(date).diff(moment(), 'milliseconds'));
  return diff < 0 ? 0 : diff;
};

const shouldBeStartedNow = lot => (moment().isAfter(lot.startTime)
  || moment().isSame(moment(lot.startTime))) && lot.status === 'pending';
const shouldBeRestartedNow = lot => (moment(lot.startTime).isAfter(moment()))
  && lot.status === 'pending';
const shouldBeClosedByTime = lot => moment(lot.endTime).isBefore(moment())
  || moment().isSame(moment(lot.endTime));

module.exports = {
  getDiffMillisecondsFromNow,
  shouldBeStartedNow,
  shouldBeRestartedNow,
  shouldBeClosedByTime,
};
