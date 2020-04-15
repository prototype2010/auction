const { ServiceProvider } = require('@adonisjs/fold');

class TaskManagerProvider extends ServiceProvider {
  register() {
    this.app.singleton('App/Providers/TaskManagerProvider', () => use('App/Helpers/TaskManager'));
    this.app.alias('App/Providers/TaskManagerProvider', 'TaskManager');
  }
}

module.exports = TaskManagerProvider;
