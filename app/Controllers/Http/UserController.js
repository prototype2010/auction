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

  async show({ params, auth, response }) {
    const { id } = params;

    const authUser = await auth.getUser();

    if (authUser.id !== parseInt(id, 10)) {
      return response.send({
        status: 403,
        message: "You can't see someone's info",
      });
    }

    const user = await User.find(id);

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

    authUser.email = email;
    authUser.password = password;
    authUser.firstname = firstname;
    authUser.lastname = lastname;
    authUser.phone = phone;
    authUser.birthday = birthday;

    await authUser.save();

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

  async passwordRecovery({ request, response }) {
    const { email } = request.only(['email']);

    const user = await User.findBy('email', email);

    if (user) {
      user.passwordRecoveryToken = uid(32);
      user.tokenExpirationDate = moment().add(24, 'hours');
      user.isTokenUsed = false;
      await user.save();

      Event.fire('user::passwordLost', user);

      response.status(200).send({ message: 'ok' });
    } else {
      response.status(404).send({ message: 'User not found' });
    }
  }

  async applyPasswordRecovery({ response, params }) {
    const { token } = params;

    const user = await User.findBy({
      passwordRecoveryToken: token,
      isTokenUsed: false,
    });

    if (user && moment().isBefore(moment(user.tokenExpirationDate))) {
      const password = uid(16);

      user.password = password;
      user.isTokenUsed = true;

      await user.save();

      Event.fire('user::passwordChanged', { ...user.toJSON(), password });

      response.status(200).send({ message: 'Password changed successfully' });
    } else {
      response.status(404).send({ message: 'Invalid token' });
    }
  }
}

module.exports = UserController;
