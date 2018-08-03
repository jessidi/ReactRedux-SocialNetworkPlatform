const Validator = require("validator");
const _ = require("lodash");

module.exports = function validateEducationInput(data) {
  let errors = {};

  data.school = _.isEmpty(data.school) ? "" : data.school;
  data.degree = _.isEmpty(data.degree) ? "" : data.degree;
  data.fieldofstudy = _.isEmpty(data.fieldofstudy) ? "" : data.fieldofstudy;
  data.from = _.isEmpty(data.from) ? "" : data.from;

  if (_.isEmpty(data.school)) {
    errors.school = "School field is required";
  }

  if (_.isEmpty(data.degree)) {
    errors.degree = "Degree field is required";
  }

  if (_.isEmpty(data.fieldofstudy)) {
    errors.fieldofstudy = "Field of study date field is required";
  }

  if (_.isEmpty(data.from)) {
    errors.from = "From date field is required";
  }

  return {
    errors: errors,
    isValid: _.isEmpty(errors)
  };
};
