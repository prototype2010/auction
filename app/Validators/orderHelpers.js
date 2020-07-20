const deliveriesTypes = [
  'Royal Mail',
  'United States Postal Service',
  'DHL Express',
];

const validArrivalType = async (data, field, message, args, get) => {
  const arrivalType = get(data, 'arrivalType');

  if (!deliveriesTypes.includes(arrivalType)) {
    throw new Error(`Available arrival types are ${deliveriesTypes}`);
  }
};
const validArrivalLocation = async (data, field, message, args, get) => {
  const arrivalLocation = get(data, 'arrivalLocation');

  if (!arrivalLocation || arrivalLocation.length < 20) {
    throw new Error('Arrival location should be 20 chars long at least');
  }
};

module.exports = { validArrivalType, validArrivalLocation };
