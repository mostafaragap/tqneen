let Joi = require("joi")

const addAreaSchema = Joi.object({
    name: Joi.object().keys({
        ar: Joi.string().required(),
        en: Joi.string().required()
    }).required(),
    city: Joi.number().min(1).required()
})
const updateAreaSchema = Joi.object({
    name: Joi.object().keys({
        ar: Joi.string(),
        en: Joi.string()
    }),
    is_active: Joi.boolean(),
    city: Joi.number().min(1)
})

const getById = Joi.object({
    id: Joi.number().min(1).required()
})

module.exports = {
    addAreaSchema,
    updateAreaSchema,
    getById
}