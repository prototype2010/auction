const { ServiceProvider } = require('@adonisjs/fold');


class LotManagerProvider extends ServiceProvider {
  register() {
    this.app.singleton('App/Providers/LotManagerProvider', () => {
      const Env = use('Env');
      const LOTS_PATH = Env.get('LOTS_PATH');

      const FileManager = use('App/Helpers/FileManager');
      const LotManager = use('App/Helpers/LotManager');


      return new LotManager(new FileManager(LOTS_PATH));
    });
    this.app.alias('App/Providers/LotManagerProvider', 'LotManager');
  }
}

module.exports = LotManagerProvider;
