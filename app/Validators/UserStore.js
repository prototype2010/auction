'use strict'

class UserStore {
  get rules () {
    return {
      email: 'required|email|unique:users',
      password: 'required',
      firstname: 'required',
      lastname: 'required',
      phone: 'required|unique:users',
      birthday: 'required',
    }
  }
}

module.exports = UserStore;
