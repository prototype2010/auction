const Redis = use('Redis');
const { getDiffMillisecondsFromNow } = use('TimeUtils');
const { LotsQueue } = use('LotsManager');

class LotListener {
  static LOT_NEW = 'lot::new'

  static LOT_CLOSED = 'lot::closed'

  static LOT_UPDATE = 'lot::update'

  static LOT_DELETE = 'lot::delete'

  static async newLot(lot) {
    const serializedLot = lot.toJSON();

    await Redis.set(lot.id, serializedLot);

    const lotTaskDelay = getDiffMillisecondsFromNow(serializedLot.startTime);

    LotsQueue.add(serializedLot, { delay: lotTaskDelay });
  }

  static async updateLot(lot) {
    await Redis.set(lot.id, JSON.stringify(lot));
  }

  static async deleteLot(lot) {
    await Redis.del(lot.id, JSON.stringify(lot));
  }
}

module.exports = LotListener;
