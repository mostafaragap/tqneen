let Joi = require("joi")
let statusEnum = require("../constants/appointmentStatus")

const createAppointment = Joi.object({
    topic: Joi.number().min(1).max(50).required(),
    specification: Joi.number().min(1).max(50).required(),
    description: Joi.string().allow(""),
    lawyer: Joi.number().min(1).required(),
    isEmmergency: Joi.boolean(),
    images: Joi.array().items(Joi.string()),
    files: Joi.array().items(Joi.string()),
})

const updateAppointment = Joi.object({
    topic: Joi.number().min(1).max(50),
    specification: Joi.number().min(1).max(50),
    description: Joi.string().min(10).max(500),
    lawyer: Joi.number().min(1),
    isEmmergency: Joi.boolean(),
    status: Joi.string().valid(...statusEnum),
    rejectReason: Joi.when('status', {
        is: 'rejected',
        then: Joi.string(),
        otherwise: Joi.forbidden(),
    }),
    payment: Joi.when('status', {
        is: 'completed',
        then: Joi.object().keys({
            isPaid: Joi.boolean().required(),
            transactionId: Joi.string().required()
        }),
        otherwise: Joi.forbidden(),
    }).required(),

}).unknown().custom((value, helpers) => {
    if (Object.keys(value).length === 0) {
        return helpers.error('object.empty');
    }
    return value;
}).messages({
    'object.empty': 'عفوا يجب ارسال اى بيانات للتحديث',
});

const getByid = Joi.object({
    id: Joi.number().min(1).required()
})


module.exports = {
    createAppointment,
    updateAppointment,
    getByid
}