
class LotManager {
  constructor(fileManager) {
    this.fileManager = fileManager;
  }

  async saveLot(lot) {
    const { id } = lot;

    return this.fileManager.save(id, this.toJSON(lot));
  }

  async getLot(lotId) {
    const fileContent = await this.fileManager.read(lotId);

    const lotInfo = this.fromJSON(fileContent);

    return lotInfo;
  }

  async updateLot(lot) {
    return this.saveLot(lot);
  }

  async deleteLot(lotId) {
    return this.fileManager.delete(lotId);
  }

  fromJSON(data) {
    try {
      return JSON.parse(data);
    } catch (e) {
      console.error(`Failed to recover JSON data from  ${data}, ${e}`);

      return {};
    }
  }

  toJSON(data) {
    try {
      return JSON.stringify(data, null, 4);
    } catch (e) {
      console.error(`Failed to stringify data ${data}`);

      return {};
    }
  }
}

module.exports = LotManager;
