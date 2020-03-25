const User = use('App/Models/User');
const Event = use('Event');

const moment = require('moment');
const uid = require('uid');

class AuthController {
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

    await auth.authenticator('jwt').revokeTokensForUser(user);

    response.status(200);
    response.send({ message: 'Logged out successfully' });
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

      response.status(200);
      response.send({ message: 'ok' });
    } else {
      response.status(404);
      response.send({ message: 'User not found' });
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

      response.status(200);
      response.send({ message: 'Password changed successfully' });
    } else {
      response.status(404);
      response.send({ message: 'Invalid token' });
    }
  }
}

module.exports = AuthController;
