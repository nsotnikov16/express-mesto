const { STATUS_OK } = require('./errors-code');

const reqSuccess = (res, data) => {
  res.status(STATUS_OK).send(data);
};

module.exports = reqSuccess;
