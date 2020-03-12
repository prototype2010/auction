'use strict';

const { BaseValidator } = require('./BaseValidator');

class UserStore extends BaseValidator {
  get rules() {
    return {
      email: 'required|email|unique:users',
      password: 'required',
      firstname: 'required',
      lastname: 'required',
      phone: 'required|unique:users',
      birthday: 'required|allowedAge',
    };
  }
}

module.exports = UserStore;
