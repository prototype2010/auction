const { hooks } = require('@adonisjs/ignitor');

hooks.after.providersBooted(() => {
  const Validator = use('Validator');
  const { allowedAge } = use('App/Validators/AllowedAge');
  const { validLotPrices } = use('App/Validators/ValidLotPrices');
  const { validLotDates } = use('App/Validators/ValidLotDates');

  Validator.extend('allowedAge', allowedAge);
  Validator.extend('validLotPrices', validLotPrices);
  Validator.extend('validLotDates', validLotDates);
});
