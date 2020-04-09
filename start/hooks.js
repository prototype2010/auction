const { hooks } = require('@adonisjs/ignitor');

hooks.after.providersBooted(() => {
  const Validator = use('Validator');
  const { allowedAge } = use('App/Validators/AllowedAge');
  const { validLotPrices, validLotDates } = use('App/Validators/lotHelpers');

  Validator.extend('allowedAge', allowedAge);
  Validator.extend('validLotPrices', validLotPrices);
  Validator.extend('validLotDates', validLotDates);
});
