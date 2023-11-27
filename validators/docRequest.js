let Joi = require("joi")

const create = Joi.object({
    flag: Joi.string().valid("idDoc", "cardDoc").required(),
    docs: Joi.array().items(Joi.string())
})

const update = Joi.object({
    status: Joi.string().valid("accepted", "rejected"),
    rejectReason: Joi.string().allow(""),
    is_active: Joi.boolean()
})

const getById = Joi.object({
    id: Joi.number().min(1).required()
})

module.exports = {
    create,
    update,
    getById
}