const Event = use('Event');

const UserListener = use('App/Listeners/UserListener');
const LotListener = use('App/Listeners/LotListener');
const BidListener = use('App/Listeners/BidListener');


Event.on(BidListener.BID_NEW, BidListener.bidAdd);

Event.on(UserListener.NEW_USER_EVENT, UserListener.newUser);
Event.on(UserListener.PASSWORD_CHANGED, UserListener.passwordChanged);
Event.on(UserListener.PASSWORD_LOST, UserListener.passwordLost);

Event.on(LotListener.LOT_CLOSE, LotListener.closeLot);
Event.on(LotListener.LOT_NEW, LotListener.newLot);
Event.on(LotListener.LOT_UPDATE, LotListener.updateLot);
Event.on(LotListener.LOT_DELETE, LotListener.deleteLot);
