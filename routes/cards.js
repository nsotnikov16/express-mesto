const router = require('express').Router();
const { Joi, celebrate } = require('celebrate');
const {
  getCards, createCard, deleteCardId, likeCard, dislikeCard,
} = require('../controllers/cards');

router.get('/', getCards);
router.delete('/:cardId', deleteCardId);
router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required(),
  }),
}), createCard);
router.put('/:cardId/likes', likeCard);
router.delete('/:cardId/likes', dislikeCard);

module.exports = router;
