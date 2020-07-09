const { ServiceProvider } = require('@adonisjs/fold');

class BidsManagerProvider extends ServiceProvider {
  register() {
    this.app.singleton('App/Providers/BidsManagerProvider', () => use('App/Helpers/BidsManager'));
    this.app.alias('App/Providers/BidsManagerProvider', 'BidsManager');
  }
}

module.exports = BidsManagerProvider;
