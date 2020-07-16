const { hooks } = require('@adonisjs/ignitor');

hooks.after.providersBooted(() => {
  const Validator = use('Validator');
  const { allowedAge } = use('App/Validators/AllowedAge');
  const { validLotPrices, validLotDates } = use('App/Validators/lotHelpers');
  const { passwordsMatch } = use('App/Validators/passwordsMatch');
  const { lotExists, validBidPrice, lotInProcess, moreThanLotCurrentPrice } = use('App/Validators/bidHelpers');

  Validator.extend('allowedAge', allowedAge);
  Validator.extend('validLotPrices', validLotPrices);
  Validator.extend('validLotDates', validLotDates);
  Validator.extend('passwordsMatch', passwordsMatch);
  Validator.extend('lotExists', lotExists);
  Validator.extend('lotInProcess', lotInProcess);
  Validator.extend('validBidPrice', validBidPrice);
  Validator.extend('moreThanLotCurrentPrice', moreThanLotCurrentPrice);
});
