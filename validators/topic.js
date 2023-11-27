let Joi = require("joi")

const addTopicSchema = Joi.object({
    name: Joi.object().keys({
        ar: Joi.string().required(),
        en: Joi.string().required()
    }).required(),
    specialization : Joi.number().required()
})

const updateTopicSchema = Joi.object({
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
    addTopicSchema,
    updateTopicSchema,
    getById
}