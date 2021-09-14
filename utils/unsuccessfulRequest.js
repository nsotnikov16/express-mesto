/* eslint-disable linebreak-style */
// eslint-disable-next-line max-len
const reqUnsuccess = (res, statusCode, errorMessage) => res.status(statusCode).send({ message: errorMessage });

module.exports = reqUnsuccess;
