const Lot = use('App/Models/Lot');

const validBidPrice = async (data, field, message, args, get) => {
  const proposedPrice = +get(data, 'proposedPrice');

  if (proposedPrice <= 0) {
    throw new Error('Proposed price must be greater than zero');
  }

  return true;
};


const lotExists = async (data, field, message, args, get) => {
  const lotId = +get(data, 'lotId');

  await Lot.findByOrFail({ id: lotId });

  return true;
};

const lotInProcess = async (data, field, message, args, get) => {
  const lotId = +get(data, 'lotId');

  await Lot.findByOrFail({ id: lotId, status: 'inProcess' });

  return true;
};

module.exports = { lotInProcess, validBidPrice, lotExists };
