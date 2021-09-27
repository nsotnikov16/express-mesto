const { Joi } = require('celebrate');

module.exports = (typeId) => {
  const validation = Joi.string().hex().length(24).required();
  if (typeId === 'cardId') {
    return {
      params: Joi.object().keys({
        cardId: validation,
      }),
    };
  }

  return {
    params: Joi.object().keys({
      userId: validation,
    }),
  };
};
