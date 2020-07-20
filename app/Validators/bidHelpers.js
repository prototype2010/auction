const Lot = use('App/Models/Lot');

const moreThanLotCurrentPrice = async (data, field, message, args, get) => {
  const lotId = +get(data, 'lotId');
  const proposedPrice = +get(data, 'proposedPrice');

  const lot = await Lot.findByOrFail({ id: lotId });

  if (lot.currentPrice > proposedPrice) {
    throw new Error('Proposed price must be greater than lot current price');
  }


  return true;
};

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

const lotClosed = async (data, field, message, args, get) => {
  const lotId = +get(data, 'lotId');

  await Lot.findByOrFail({ id: lotId, status: 'closed' });

  return true;
};

const lotInProcess = async (data, field, message, args, get) => {
  const lotId = +get(data, 'lotId');

  await Lot.findByOrFail({ id: lotId, status: 'inProcess' });

  return true;
};

module.exports = { lotInProcess, validBidPrice, lotExists, moreThanLotCurrentPrice, lotClosed };
