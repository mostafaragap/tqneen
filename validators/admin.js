let Joi = require("joi")


const loginSchema = Joi.object({
    email: Joi.string().email().min(5).max(50),
    password: Joi.string().min(6).max(50).required()
})

const changePasswordSchema = Joi.object({
    current_password: Joi.string().min(6).max(50).required(),
    new_password: Joi.string().min(6)
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()])[A-Za-z\d!@#$%^&*()]{8,}$/)
        .required().messages({
            'string.pattern.base': 'كلمة السر يجب ان تحتوى على حروف وارقام و رموز',
        })
})



module.exports = {
    loginSchema,
    changePasswordSchema
}