const User = use('App/Models/User');
const Event = use('Event');

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
}

module.exports = UserController;
