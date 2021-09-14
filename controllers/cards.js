/* eslint-disable linebreak-style */
const Card = require('../models/card');
const reqSuccess = require('../utils/successfulRequest');
const reqUnsuccess = require('../utils/unsuccessfulRequest');

const {
  ERROR_BAD_REQUEST,
  ERROR_NOT_FOUND,
  ERROR_DEFAULT,
} = require('../utils/errors-code');

const ValidationError = require('../utils/classes/ValidationError');
const NotFoundError = require('../utils/classes/NotFoundError');

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    // eslint-disable-next-line no-undef
    // eslint-disable-next-line no-shadow
    .then((card) => reqSuccess(res, card))
    .catch((err) => {
      // eslint-disable-next-line no-unused-expressions
      ValidationError ? reqUnsuccess(res, ERROR_BAD_REQUEST, 'Переданы некорректные данные при создании карточки') : reqUnsuccess(res, ERROR_DEFAULT, `Ошибка: ${err.message}`);
    });
};

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => reqSuccess(res, cards))
    .catch((err) => reqUnsuccess(res, ERROR_DEFAULT, `Ошибка: ${err.message}`));
};

module.exports.deleteCardId = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    // eslint-disable-next-line no-shadow
    .then(() => reqSuccess(res, { message: 'Card deleted' }))
    .catch(() => {
      if (NotFoundError) reqUnsuccess(res, ERROR_NOT_FOUND, 'Карточка с указанным _id не найдена');
    });
};

module.exports.likeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } },
  { new: true },
// eslint-disable-next-line no-shadow
).then(() => reqSuccess(res, { message: 'Like card' }))
  .catch((err) => {
    // eslint-disable-next-line no-unused-expressions
    (ValidationError ? reqUnsuccess(res, ERROR_BAD_REQUEST, 'Переданы некорректные данные для постановки/снятии лайка') : reqUnsuccess(res, ERROR_DEFAULT, `Ошибка: ${err.message}`));
  });

module.exports.dislikeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } },
  { new: true },
// eslint-disable-next-line no-shadow
).then(() => reqSuccess(res, { message: 'Dislike card' }))
  .catch((err) => {
  // eslint-disable-next-line no-unused-expressions
    (ValidationError ? reqUnsuccess(res, ERROR_BAD_REQUEST, 'Переданы некорректные данные для постановки/снятии лайка') : reqUnsuccess(res, ERROR_DEFAULT, `Ошибка: ${err.message}`));
  });
