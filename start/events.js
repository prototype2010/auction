const Env = use('Env');
const Event = use('Event');
const Mail = use('Mail');
const APP_EMAIL = Env.get('SUPPORT_MAIL');
const Redis = use('Redis');
const LotManager = use('LotManager');
const { NewLotsQueue } = use('TaskManager');
const { getDiffMillisecondsFromNow } = use('TimeUtils');


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
    'emails.passwordRecovery',
    { ...user.toJSON(), passwordRecoveryToken: user.passwordRecoveryToken },
    message => {
      message
        .to(user.email)
        .from(APP_EMAIL)
        .subject('Recovery password process');
    },
  );
});


Event.on('lot::new', async lot => {
  await LotManager.saveLot(lot);

  const serializedLot = lot.toJSON();

  await Redis.set(lot.id, serializedLot);

  const lotTaskDelay = getDiffMillisecondsFromNow(serializedLot.lotStartTime);

  NewLotsQueue.add(serializedLot, { delay: lotTaskDelay });
});

Event.on('lot::update', async lot => {
  await LotManager.updateLot(lot);

  await Redis.set(lot.id, JSON.stringify(lot));
});

Event.on('lot::delete', async lot => {
  await LotManager.deleteLot(lot.id);

  await Redis.del(lot.id, JSON.stringify(lot));
});
