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
  Route.post('login', 'UserController.login');
  Route.post('logout', 'UserController.logout');
  Route.post('refresh', 'UserController.refresh');
  Route.post('password-recovery', 'UserController.initiatePasswordReset');
  Route.post('password-recovery/:token', 'UserController.applyPasswordRecovery').validator('passwordUpdate');
}).prefix('users/auth');

Route.group(() => {
  Route.post('approve-delivered/:id', 'OrderController.approveDelivered');
  Route.post('approve-sent/:id', 'OrderController.approveSent');
}).prefix('orders').middleware('auth');

Route.resource('orders', 'OrderController')
  .only(['update', 'store', 'index', 'show', 'destroy'])
  .validator(new Map([
    [['orders.store'], ['OrderStore']],
    [['orders.update'], ['OrderStore']]]))
  .middleware('auth');


Route.post('users', 'UserController.store').validator('UserStore');
Route.get('users/profile', 'UserController.profile').middleware('auth');

Route.resource('users', 'UserController')
  .only(['update'])
  .middleware('auth');

Route.get('lots/my', 'LotController.myLots').middleware('auth');

Route.resource('lots', 'LotController')
  .validator(new Map([[['lots.store'], ['LotStore']]]))
  .middleware('auth');

Route.resource('bids', 'BidController')
  .validator(new Map([
    [['bids.store'], ['BidStore']],
    [['bids.update'], ['BidStore']],
  ]))
  .middleware('auth');
