const Env = use('Env');
const APP_EMAIL = Env.get('SUPPORT_MAIL');
const Mail = use('Mail');

class UserListener {
  static async newUser(user) {
    await Mail.send('emails.welcome', user, message => {
      message
        .to(user.email)
        .from(APP_EMAIL)
        .subject('Welcome to yardstick');
    });
  }

  static async passwordChanged(user) {
    await Mail.send('emails.passwordChanged', user, message => {
      message
        .to(user.email)
        .from(APP_EMAIL)
        .subject('Password changed successfully');
    });
  }

  static async passwordLost(user) {
    await Mail.send(
      'emails.initiatePasswordReset',
      { ...user.toJSON(), passwordRecoveryToken: user.passwordRecoveryToken },
      message => {
        message
          .to(user.email)
          .from(APP_EMAIL)
          .subject('Recovery password process');
      },
    );
  }
}

const USER_EVENTS = {
  NEW_USER_EVENT: 'user::new',
  PASSWORD_CHANGED: 'user::passwordChanged',
  PASSWORD_LOST: 'user::passwordLost',
};

module.exports = { UserListener, USER_EVENTS };
