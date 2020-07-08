const Lot = use('App/Models/Lot');

const validBidPrice = async (data, field, message, args, get) => {
  const proposedPrice = +get(data, 'proposedPrice');

  if (proposedPrice <= 0) {
    throw new Error('Proposed price must be greater than zero');
  }

  return true;
};


const lotExists = async (data, field, message, args, get) => {
  const lodId = +get(data, 'lodId');

  await Lot.findByOrFail({ id: lodId });

  return true;
};

const lotInProcess = async (data, field, message, args, get) => {
  const lodId = +get(data, 'lodId');

  await Lot.findByOrFail({ id: lodId, status: 'inProcess' });

  return true;
};

module.exports = { lotInProcess, validBidPrice, lotExists };
