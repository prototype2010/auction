const Env = use('Env');
const Event = use('Event');
const Mail = use('Mail');
const APP_EMAIL = Env.get('SUPPORT_MAIL');
const Redis = use('Redis');
const Lot = use('App/Models/Lot');
const Bid = use('App/Models/Bid');
const { LotsQueue } = use('LotsManager');
const { BidsQueue } = use('BidsManager');
const { getDiffMillisecondsFromNow } = use('TimeUtils');


Event.on('bid::new', async bid => {
  BidsQueue.add(bid, { delay: 0 });
});

Event.on('user::new', async user => {
  await Mail.send('emails.welcome', user, message => {
    message
      .to(user.email)
      .from(APP_EMAIL)
      .subject('Welcome to yardstick');
  });
});

Event.on('user::passwordChanged', async user => {
  await Mail.send('emails.passwordChanged', user, message => {
    message
      .to(user.email)
      .from(APP_EMAIL)
      .subject('Password changed successfully');
  });
});

Event.on('user::passwordLost', async user => {
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
});

/* eslint-disable */
Event.on('lot::closed', async lot => {


});

Event.on('lot::new', async lot => {
  const serializedLot = lot.toJSON();

  await Redis.set(lot.id, serializedLot);

  const lotTaskDelay = getDiffMillisecondsFromNow(serializedLot.startTime);

  LotsQueue.add(serializedLot, { delay: lotTaskDelay });
});

Event.on('lot::update', async lot => {
  await Redis.set(lot.id, JSON.stringify(lot));
});

Event.on('lot::delete', async lot => {
  await Redis.del(lot.id, JSON.stringify(lot));
});
