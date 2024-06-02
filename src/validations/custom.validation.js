import { MIN_PASSWORD_LENGTH } from '../shared/constants/app.constant.js';

export const password = (value, helpers) => {
  if (value.length < MIN_PASSWORD_LENGTH) {
    return helpers.message(`password must be at least ${MIN_PASSWORD_LENGTH} characters`);
  }
  if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
    return helpers.message('password must contain at least 1 letter and 1 number');
  }
  return value;
};
