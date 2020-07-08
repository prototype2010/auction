/* eslint-disable */
const Env = use('Env');
const Event = use('Event');
const Mail = use('Mail');
const APP_EMAIL = Env.get('MAIL_USERNAME');

Event.on('user::new', async (user) => {
  await Mail.send('emails.welcome', user, (message) => {
    message
      .to(user.email)
      .from(APP_EMAIL)
      .subject('Welcome to yardstick');
  });
});

Event.on('user::passwordChanged', async (user) => {
  await Mail.send('emails.passwordChanged', user, (message) => {
    message
      .to(user.email)
      .from(APP_EMAIL)
      .subject('Password changed successfully');
  });
});

Event.on('user::passwordLost', async (user) => {
  await Mail.send(
    'emails.passwordRecovery',
    { ...user.toJSON(), passwordRecoveryToken: user.passwordRecoveryToken },
    (message) => {
      message
        .to(user.email)
        .from(APP_EMAIL)
        .subject('Recovery password process');
    }
  );
});
