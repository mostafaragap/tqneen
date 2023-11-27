let Joi = require("joi")

const addSpecializationSchema = Joi.object({
    name: Joi.object().keys({
        ar: Joi.string().required(),
        en: Joi.string().required()
    }).required(),
})

const updateSpecializationSchema = Joi.object({
    name: Joi.object().keys({
        ar: Joi.string().required(),
        en: Joi.string().required()
    }), 
    is_active : Joi.boolean()
})

const getById = Joi.object({
    id : Joi.number().min(1).required()
})

module.exports = {
    addSpecializationSchema,
    updateSpecializationSchema,
    getById
}