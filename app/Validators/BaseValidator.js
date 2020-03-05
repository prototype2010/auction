class BaseValidator {
  async fails(errorMessages) {
    return this.ctx.response.status('422').send(errorMessages);
  }

  get validateAll() {
    return true;
  }
}

module.exports = { BaseValidator };
