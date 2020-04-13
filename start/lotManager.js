const { ioc } = require('@adonisjs/fold');

ioc.singleton('LotManager', () => {
  console.log('LOT MANAGER BINDED');

  const Env = use('Env');
  const LOTS_PATH = Env.get('LOTS_PATH');

  const { LotManager } = require('../helpers/LotManager');
  const { FileManager } = require('../helpers/FileManager');

  const fileManager = FileManager.getInstance(LOTS_PATH);

  return LotManager.getInstance(fileManager);
});
