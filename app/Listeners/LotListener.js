const Redis = use('Redis');
const { getDiffMillisecondsFromNow } = use('TimeUtils');
const { LotsQueue } = use('LotsManager');

class LotListener {
  static async newLot(lot) {
    const serializedLot = lot.toJSON();

    await Redis.set(lot.id, serializedLot);

    const lotTaskDelay = getDiffMillisecondsFromNow(lot.startTime);

    LotsQueue.add(serializedLot, { delay: lotTaskDelay });
  }

  static async updateLot(lot) {
    await Redis.set(lot.id, JSON.stringify(lot));
  }

  static async deleteLot(lot) {
    await Redis.del(lot.id, JSON.stringify(lot));
  }
  /* eslint-disable */
  static async closeLot(lot) {

  }
}

const LOT_EVENTS = {
  LOT_NEW : 'lot::new',
  LOT_CLOSE:'lot::closed',
  LOT_UPDATE :'lot::update',
  LOT_DELETE :'lot::delete',
}

module.exports = { LotListener, LOT_EVENTS };
