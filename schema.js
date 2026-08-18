const Joi = require("joi");

module.exports.listingJoiSchema = Joi.object({
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

module.exports.reviewJoiSchema = Joi.object({
    review : Joi.object({
        rating : Joi.number().required().min(1).max(5),
        comment : Joi.string().required(),
    }).required()
})


