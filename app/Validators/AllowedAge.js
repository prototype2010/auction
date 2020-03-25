const moment = require('moment');

const MINIMUM_ALLOWED_AGE = 21;

const allowedAge = async (data, field, message, args, get) => {
  const value = get(data, field);
  if (value) {
    const date = moment(value);

    if (date.isValid()) {
      const providedDateYear = date.year();
      const currentYear = moment().year();

      if (currentYear - providedDateYear < MINIMUM_ALLOWED_AGE) {
        throw new Error(`Allowed age is more than ${MINIMUM_ALLOWED_AGE}`);
      }
    }
  }
};

module.exports = { allowedAge };
