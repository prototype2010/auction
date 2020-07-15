const Event = use('Event');
const Redis = use('Redis');
const { LotsQueue } = use('LotsManager');
const { BidsQueue } = use('BidsManager');
const { getDiffMillisecondsFromNow } = use('TimeUtils');
const UserListener = use('App/Listeners/UserListener');


Event.on('bid::new', async bid => {
  BidsQueue.add(bid, { delay: 0 });
});

Event.on(UserListener.NEW_USER_EVENT, UserListener.newUser);
Event.on(UserListener.PASSWORD_CHANGED, UserListener.passwordChanged);
Event.on(UserListener.PASSWORD_LOST, UserListener.passwordLost);

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
