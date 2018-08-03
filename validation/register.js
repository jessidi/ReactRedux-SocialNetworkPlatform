const Validator = require("validator");
const _ = require("lodash");

module.exports = function validateRegisterInput(data) {
  let errors = {};

  data.name = _.isEmpty(data.name) ? "" : data.name;
  data.email = _.isEmpty(data.email) ? "" : data.email;
  data.password = _.isEmpty(data.password) ? "" : data.password;
  data.password2 = _.isEmpty(data.password2) ? "" : data.password2;

  if (!Validator.isLength(data.name, { min: 2, max: 30 })) {
    errors.name = "Name must be between 2 and 30 characters";
  }
  if (_.isEmpty(data.name)) {
    errors.name = "Name field is required";
  }

  if (!Validator.isEmail(data.email)) {
    errors.email = "Email is invalid";
  }
  if (_.isEmpty(data.email)) {
    errors.email = "Email field is required";
  }

  if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
    errors.password = "Password must be between 6 and 30 characters";
  }
  if (_.isEmpty(data.password)) {
    errors.password = "Password field is required";
  }

  if (!Validator.equals(data.password2, data.password)) {
    errors.password2 = "Password must match";
  }
  if (_.isEmpty(data.password2)) {
    errors.password2 = "Password must be confirmed";
  }

  return {
    errors: errors,
    isValid: _.isEmpty(errors)
  };
};
