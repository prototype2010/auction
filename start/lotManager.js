const { ioc } = require('@adonisjs/fold');

const Env = use('Env');
const LOTS_PATH = Env.get('LOTS_PATH');
const { FileManager } = require('../app/Helpers/FileManager');
const { LotManager } = require('../app/Helpers/LotManager');

const fileManager = FileManager.getInstance(LOTS_PATH);

ioc.singleton('App/Helpers/LotManager', () => LotManager.getInstance(fileManager));
