'use strict';

const { BaseValidator } = require('./BaseValidator');

class PasswordUpdate extends BaseValidator {
  get rules() {
    return {
      password: 'required',
      repeatPassword: 'required|passwordsMatch',
    };
  }
}

module.exports = PasswordUpdate;
