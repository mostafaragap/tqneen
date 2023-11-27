let Joi = require("joi")

const addCitySchema = Joi.object({
    name: Joi.object().keys({
        ar: Joi.string().required(),
        en: Joi.string().required()
    }).required()
})
const updateCitySchema = Joi.object({
    name: Joi.object().keys({
        ar: Joi.string(),
        en: Joi.string()
    }),
    is_active: Joi.boolean()
})

const getById = Joi.object({
    id: Joi.number().min(1).required()
})

module.exports = {
    addCitySchema,
    updateCitySchema,
    getById
}