const Event = use('Event');
const { BidsQueue } = use('BidsManager');
const UserListener = use('App/Listeners/UserListener');
const LotListener = use('App/Listeners/LotListener');


Event.on('bid::new', async bid => {
  BidsQueue.add(bid, { delay: 0 });
});

Event.on(UserListener.NEW_USER_EVENT, UserListener.newUser);
Event.on(UserListener.PASSWORD_CHANGED, UserListener.passwordChanged);
Event.on(UserListener.PASSWORD_LOST, UserListener.passwordLost);

/* eslint-disable */
Event.on('lot::closed', async lot => {


});

Event.on(LotListener.LOT_NEW, LotListener.newLot);

Event.on(LotListener.LOT_UPDATE,LotListener.updateLot);

Event.on(LotListener.LOT_DELETE, LotListener.deleteLot);
