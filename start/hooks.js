const { hooks } = require('@adonisjs/ignitor');

hooks.after.providersBooted(() => {
  const Validator = use('Validator');
  const { allowedAge } = use('App/Validators/AllowedAge');

  Validator.extend('allowedAge', allowedAge);
});
