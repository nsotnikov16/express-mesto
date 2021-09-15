const User = require('../models/user');
const reqSuccess = require('../utils/successfulRequest');
const reqUnsuccess = require('../utils/unsuccessfulRequest');
const {
  ERROR_BAD_REQUEST,
  ERROR_NOT_FOUND,
  ERROR_DEFAULT,
} = require('../utils/errors-code');

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
      if (err.name === 'CastError') {
        reqUnsuccess(res, ERROR_BAD_REQUEST, 'Переданы некорректные данные при создании пользователя');
      } else {
        reqUnsuccess(res, ERROR_DEFAULT, `Ошибка: ${err.message}`);
      }
    });
};

module.exports.getUserId = (req, res) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        return reqUnsuccess(res, ERROR_NOT_FOUND, 'Пользователь по указанному _id не найден.');
      }
      return reqSuccess(res, user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        reqUnsuccess(res, ERROR_BAD_REQUEST, 'Переданы некорректные данные при получении пользователя по _id');
      } else {
        reqUnsuccess(res, ERROR_DEFAULT, `Ошибка: ${err.message}`);
      }
    });
};

module.exports.updateProfile = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, {
    new: true,
    runValidators: true,
    context: 'query',
  })
    .then((user) => {
      if (!user) {
        reqUnsuccess(res, ERROR_NOT_FOUND, 'Пользователь по указанному _id не найден.');
      } else {
        reqSuccess(res, user);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        reqUnsuccess(res, ERROR_BAD_REQUEST, 'Переданы некорректные данные при обновлении профиля');
      } else {
        reqUnsuccess(res, ERROR_DEFAULT, `Ошибка: ${err.message}`);
      }
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, {
    new: true,
    runValidators: true,
    context: 'query',
  })
    .then((user) => {
      if (!user) {
        reqUnsuccess(res, ERROR_NOT_FOUND, 'Пользователь по указанному _id не найден.');
      } else {
        reqSuccess(res, user);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        reqUnsuccess(res, ERROR_BAD_REQUEST, 'Переданы некорректные данные при обновлении аватара');
      } else {
        reqUnsuccess(res, ERROR_DEFAULT, `Ошибка: ${err.message}`);
      }
    });
};
