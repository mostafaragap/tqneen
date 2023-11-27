let Joi = require("joi")

const getBykey = Joi.object({
    key: Joi.string().min(5).max(100).required()
})


module.exports = {getBykey}

