const moment = require('moment');

const getDiffMillisecondsFromNow = date => (moment().diff(moment(date)))
  .millisecond();

module.exports = { getDiffMillisecondsFromNow };
