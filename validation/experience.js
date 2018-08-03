const Validator = require("validator");
const _ = require("lodash");

module.exports = function validateExperienceInput(data) {
  let errors = {};

  data.title = _.isEmpty(data.title) ? "" : data.title;
  data.company = _.isEmpty(data.company) ? "" : data.company;
  data.from = _.isEmpty(data.from) ? "" : data.from;

  if (_.isEmpty(data.title)) {
    errors.title = "Title field is required";
  }

  if (_.isEmpty(data.company)) {
    errors.company = "Company field is required";
  }

  if (_.isEmpty(data.from)) {
    errors.from = "From date field is required";
  }

  return {
    errors: errors,
    isValid: _.isEmpty(errors)
  };
};
