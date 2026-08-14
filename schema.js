const Joi = require("joi");

const listingJoiSchema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().required().min(1),
    location: Joi.string().required(),
    country: Joi.string().required(),
    image: Joi.object({
        filename: Joi.string(),
        url: Joi.string().allow("", null),
    }),
});

module.exports = listingJoiSchema;

