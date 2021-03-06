'use strict';

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route');

Route.group(() => {
  Route.post('login', 'AuthController.login');
  Route.post('logout', 'AuthController.logout');
  Route.post('refresh', 'AuthController.refresh');
  Route.post('password-recovery', 'AuthController.passwordRecovery');
  Route.get('password-recovery/:token', 'AuthController.applyPasswordRecovery');
}).prefix('users/auth');

Route.post('users', 'UserController.store').validator('UserStore');
//
Route.resource('users', 'UserController')
  .only(['show', 'update'])
  .middleware('auth');

Route.resource('lots', 'LotController')
  .validator(new Map([[['lots.store'], ['LotStore']]]))
  .middleware('auth');
