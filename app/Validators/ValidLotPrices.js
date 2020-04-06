
const validLotPrices = async (data, field, message, args, get) => {

  const currentPrice = +get(data, 'currentPrice');
  const estimatedPrice = +get(data, 'estimatedPrice');

  if (estimatedPrice < currentPrice) {
    throw new Error('Estimated price cannot be lower than current price');
  }

  return true;
};

module.exports = { validLotPrices };
