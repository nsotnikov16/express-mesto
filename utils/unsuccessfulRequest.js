const reqUnsuccess = (res, statusCode, errorMessage) => {
  res.status(statusCode).send({ message: errorMessage });
};

module.exports = reqUnsuccess;
