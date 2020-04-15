const { ServiceProvider } = require('@adonisjs/fold');

class TimeUtilsProvider extends ServiceProvider {
  register() {
    this.app.singleton('App/Providers/TimeUtilsProvider', () => use('App/Helpers/TimeUtils'));
    this.app.alias('App/Providers/TimeUtilsProvider', 'TimeUtils');
  }
}

module.exports = TimeUtilsProvider;
