const { hooks } = require('@adonisjs/ignitor');

hooks.after.providersBooted(() => {
  const Validator = use('Validator');
  const { allowedAge } = use('App/Validators/AllowedAge');
  const { validLotPrices, validLotDates } = use('App/Validators/lotHelpers');
  const { passwordsMatch } = use('App/Validators/passwordsMatch');

  Validator.extend('allowedAge', allowedAge);
  Validator.extend('validLotPrices', validLotPrices);
  Validator.extend('validLotDates', validLotDates);
  Validator.extend('passwordsMatch', passwordsMatch);
});
