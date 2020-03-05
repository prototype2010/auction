'use strict';

const User = use('App/Models/User');

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
  async show({ params }) {
    const { id } = params;

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
  async update({ params, request, response }) {
    const { id } = params;
    const { email, password } = request.post();

    const user = await User.find(id);

    if (user) {
      user.email = email;
      user.password = password;

      await user.save();

      const updatedUser = await User.find(id);

      return updatedUser;
    }

    response.status(404);

    response.send({ message: 'User not found' });
  }

  /**
   * Delete a user with id.
   * DELETE users/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  // async destroy ({ params, request, response }) {}
}

module.exports = UserController;
