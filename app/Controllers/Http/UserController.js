const User = use('App/Models/User');
const Event = use('Event');

const moment = require('moment');
const uid = require('uid');

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with users
 */

class UserController {
  /**
   * Create/save a new user.
   * POST users
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */

  async store({ request }) {
    const params = request.only([
      'email',
      'password',
      'firstname',
      'lastname',
      'phone',
      'birthday',
    ]);

    const user = await User.create(params);

    Event.fire('user::new', user.toJSON());

    return user;
  }

  /**
   * Display a single user.
   * GET users/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */

  async profile({ auth }) {
    const authUser = await auth.getUser();

    const user = await User.find(authUser.id);

    return user;
  }

  /**
   * Update user details.
   * PUT or PATCH users/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */

  async update({ params, request, response, auth }) {
    const { id } = params;

    const {
      email,
      password,
      firstname,
      lastname,
      phone,
      birthday,
    } = request.only([
      'email',
      'password',
      'firstname',
      'lastname',
      'phone',
      'birthday',
    ]);
    const authUser = await auth.getUser();

    if (authUser.id !== parseInt(id, 10)) {
      response.status(403).send({
        status: 403,
        message: "You can't update someone's info",
      });
    }

    await authUser.merge({
      email,
      password,
      firstname,
      lastname,
      phone,
      birthday,
    });

    return authUser;
  }

  async login({ auth, request }) {
    const { email, password } = request.only(['email', 'password']);

    const tokenInfo = await auth.withRefreshToken().attempt(email, password);

    return tokenInfo;
  }

  async refresh({ auth, request }) {
    const refreshToken = request.header('refresh_token');
    const newTokenInfo = await auth
      .newRefreshToken()
      .generateForRefreshToken(refreshToken, true);

    return newTokenInfo;
  }

  async logout({ auth, response }) {
    const user = await auth.getUser();

    await auth
      .authenticator('jwt')
      .revokeTokensForUser(user);

    response.status(200).send({ message: 'Logged out successfully' });
  }

  async initiatePasswordReset({ request, response }) {
    const { email } = request.only(['email']);

    const user = await User.findByOrFail('email', email);

    user.passwordRecoveryToken = uid(32);
    user.tokenExpirationDate = moment().add(24, 'hours');
    await user.save();

    Event.fire('user::passwordLost', user);

    response.status(200).send({ message: 'ok' });
  }

  async applyPasswordRecovery({ response, params, request }) {
    const { token } = params;

    const { password } = request.only([
      'password',
    ]);


    const user = await User.findByOrFail({ passwordRecoveryToken: token });

    if (moment().isBefore(moment(user.tokenExpirationDate))) {
      user.password = password;
      user.passwordRecoveryToken = null;

      await user.save();

      await Event.fire('user::passwordChanged', user);

      response.send({ message: 'Password changed successfully' });
    }
  }
}

module.exports = UserController;
