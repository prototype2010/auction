const { ServiceProvider } = require('@adonisjs/fold');

class LotsManagerProvider extends ServiceProvider {
  register() {
    this.app.singleton('App/Providers/LotsManagerProvider', () => use('App/Helpers/LotsManager'));
    this.app.alias('App/Providers/LotsManagerProvider', 'LotsManager');
  }
}

module.exports = LotsManagerProvider;
