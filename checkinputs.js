/* jshint esversion: 6 */
/* jshint node: true */
const passwordValidator = require('password-validator');
const emailValidator = require('email-validator');

const requirementsPassword = new passwordValidator();

requirementsPassword
  .is().min(3)
  .is().max(50)
  // .has().uppercase()
  .has().lowercase()
  // .has().digits()
  .has().not().spaces();

let rx = /[!@#$%^&*.()_+\-=\[\]{};:\\|<>\/?\`\~ (0-9)]/;

module.exports = function(inputData) {
  let keys = Object.keys(inputData);
  let result = {
    error: {},
    data: {},
    msg: {}
  };

  keys.forEach((key) => {
    if (inputData[key].length == 0) {
      result.error[key] = 'isEmpty';
      result.data[key] = null;
      result.msg[key] = 'Missing';
    } else {

      if (key == 'user_firstName' || key == 'user_lastName') {
        if (inputData[key].search(rx) >= 0) {
          result.error[key] = 'isInvalid';
          result.data[key] = null;
          result.msg[key] = `Can't have special characters, numbers or spaces`;
        } else {
          // result.error[key] = '';
          result.data[key] = inputData[key];
          // result.msg[key] = '';
        }
      } else if (key == 'user_email') {
        if (emailValidator.validate(inputData[key]) == false) {
          result.error[key] = 'isInvalid';
          result.data[key] = null;
          result.msg[key] = 'Email is incorrect';
        } else {
          result.data[key] = inputData[key];
        }
      } else if (key == 'user_password') {
        result.data[key] = null;
        result.data.user_passwordConf = null;

        let fails = requirementsPassword.validate(inputData[key], {
          list:true
        });

        fails.forEach((fail) => {

          switch (fail) {
            case 'min':
              result.error.user_password = 'isInvalid';
              result.msg.user_password = 'Must be more than 8 characters long';
              break;
            case 'spaces':
              result.error.user_password = 'isInvalid';
              result.msg.user_password = `Can't have spaces`;
              break;
            case 'digits':
              result.error.user_password = 'isInvalid';
              result.msg.user_password = 'Password must have numbers';
              break;
            case 'uppercase':
              result.error.user_password = 'isInvalid';
              result.msg.user_password = 'Password must have uppercase characters';
              break;
          }
        });
      } else if (inputData.user_password !== inputData.user_passwordConf) {
        result.error.user_password = 'isInvalid';
        result.error.user_passwordConf = 'isInvalid';
        result.msg.user_password = `Passwords don't match`;
      }
    }
  });
  return result;
};
