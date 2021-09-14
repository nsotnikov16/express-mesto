/* eslint-disable linebreak-style */
const User = require('../models/user');
const reqSuccess = require('../utils/successfulRequest');
const reqUnsuccess = require('../utils/unsuccessfulRequest');
const {
  ERROR_BAD_REQUEST,
  ERROR_NOT_FOUND,
  ERROR_DEFAULT,
} = require('../utils/errors-code');

const ValidationError = require('../utils/classes/ValidationError');
const NotFoundError = require('../utils/classes/NotFoundError');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => reqSuccess(res, users))
    .catch((err) => reqUnsuccess(res, ERROR_DEFAULT, `Ошибка: ${err.message}`));
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => reqSuccess(res, user))
    .catch((err) => {
      // eslint-disable-next-line no-unused-expressions
      ValidationError ? reqUnsuccess(res, ERROR_BAD_REQUEST, 'Переданы некорректные данные при создании пользователя') : reqUnsuccess(res, ERROR_DEFAULT, `Ошибка: ${err.message}`);
    });
};

module.exports.getUserId = (req, res) => {
  User.findById(req.user._id)
    .then((user) => reqSuccess(res, user))
    .catch((err) => (NotFoundError ? reqUnsuccess(res, ERROR_NOT_FOUND, 'Пользователь по указанному _id не найден.') : reqUnsuccess(res, ERROR_DEFAULT, `Ошибка: ${err.message}`)));
};

module.exports.updateProfile = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about })
    .then((user) => reqSuccess(res, user))
    .catch((err) => (ValidationError ? reqUnsuccess(res, ERROR_BAD_REQUEST, 'Переданы некорректные данные при обновлении профиля') : reqUnsuccess(res, ERROR_DEFAULT, `Ошибка: ${err.message}`)));
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar })
    .then((user) => reqSuccess(res, user))
    .catch((err) => {
      if (ValidationError) { reqUnsuccess(res, ERROR_BAD_REQUEST, 'Переданы некорректные данные при обновлении аватара'); } else if (NotFoundError) { reqUnsuccess(res, ERROR_BAD_REQUEST, 'Пользователь с указанным _id не найден'); } else { reqUnsuccess(res, ERROR_DEFAULT, `Ошибка: ${err.message}`); }
    });
};
