const Card = require('../models/card');
const reqSuccess = require('../utils/successfulRequest');
const reqUnsuccess = require('../utils/unsuccessfulRequest');

const {
  ERROR_BAD_REQUEST,
  ERROR_NOT_FOUND,
  ERROR_DEFAULT,
} = require('../utils/errors-code');

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => {
      reqSuccess(res, card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        reqUnsuccess(res, ERROR_BAD_REQUEST, 'Переданы некорректные данные при создании карточки');
      } else {
        reqUnsuccess(res, ERROR_DEFAULT, `Ошибка: ${err.message}`);
      }
    });
};

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => reqSuccess(res, cards))
    .catch((err) => reqUnsuccess(res, ERROR_DEFAULT, `Ошибка: ${err.message}`));
};

module.exports.deleteCardId = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((data) => {
      if (!data) {
        reqUnsuccess(res, ERROR_NOT_FOUND, 'Карточка с указанным _id не найдена');
        return;
      }
      reqSuccess(res, { message: 'Card deleted' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        reqUnsuccess(res, ERROR_BAD_REQUEST, 'Переданы некорректные данные в метод удаления карточки');
      } else {
        reqUnsuccess(res, ERROR_DEFAULT, `Ошибка: ${err.message}`);
      }
    });
};

module.exports.likeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } },
  { new: true },
).then((data) => {
  if (!data) {
    return reqUnsuccess(res, ERROR_NOT_FOUND, 'Карточка с указанным _id не найдена');
  }
  return reqSuccess(res, { message: 'Like card' });
})
  .catch((err) => {
    if (err.name === 'CastError') {
      reqUnsuccess(res, ERROR_BAD_REQUEST, 'Переданы некорректные данные для постановки/снятии лайка');
    } else {
      reqUnsuccess(res, ERROR_DEFAULT, `Ошибка: ${err.message}`);
    }
  });

module.exports.dislikeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } },
  { new: true },
).then((data) => {
  if (!data) {
    return reqUnsuccess(res, ERROR_NOT_FOUND, 'Карточка с указанным _id не найдена');
  }
  return reqSuccess(res, { message: 'Dislike card' });
})
  .catch((err) => {
    if (err.name === 'CastError') {
      reqUnsuccess(res, ERROR_BAD_REQUEST, 'Переданы некорректные данные для постановки/снятии лайка');
    } else {
      reqUnsuccess(res, ERROR_DEFAULT, `Ошибка: ${err.message}`);
    }
  });
