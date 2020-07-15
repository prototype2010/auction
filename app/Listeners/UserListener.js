const Env = use('Env');
const APP_EMAIL = Env.get('SUPPORT_MAIL');
const Mail = use('Mail');

class UserListener {
  static NEW_USER_EVENT = 'user::new'

  static PASSWORD_CHANGED = 'user::passwordChanged'

  static PASSWORD_LOST = 'user::passwordLost'

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

module.exports = UserListener;
