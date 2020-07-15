const Event = use('Event');

const { UserListener, USER_EVENTS } = use('App/Listeners/UserListener');
const { LotListener, LOT_EVENTS } = use('App/Listeners/LotListener');
const { BidListener, BID_EVENTS } = use('App/Listeners/BidListener');


Event.on(BID_EVENTS.BID_NEW, BidListener.bidAdd);

Event.on(USER_EVENTS.NEW_USER_EVENT, UserListener.newUser);
Event.on(USER_EVENTS.PASSWORD_CHANGED, UserListener.passwordChanged);
Event.on(USER_EVENTS.PASSWORD_LOST, UserListener.passwordLost);

Event.on(LOT_EVENTS.LOT_CLOSE, LotListener.closeLot);
Event.on(LOT_EVENTS.LOT_NEW, LotListener.newLot);
Event.on(LOT_EVENTS.LOT_UPDATE, LotListener.updateLot);
Event.on(LOT_EVENTS.LOT_DELETE, LotListener.deleteLot);
