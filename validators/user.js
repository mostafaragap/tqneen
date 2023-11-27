let Joi = require("joi")
const allRoles = require("../constants/user")
const { isValidObjectId } = require("mongoose")
// const { isValidObjectId } = require("mongoose")


const signUpSchema = Joi.object({
    email: Joi.string().email().min(5).max(50),
    password: Joi.string().min(6).required()
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()])[A-Za-z\d!@#$%^&*()]{8,}$/)
        .required().messages({
            'string.pattern.base': 'كلمة السر يجب ان تحتوى على حروف وارقام و رموز',
        }),
    first_name: Joi.string().trim().max(50).required(),
    last_name: Joi.string().trim().max(50).required(),
    phone: Joi.string().regex(/^(201|01|00201)[0-2,5]{1}[0-9]{8}/).message("invalid phone").required(),
    gender: Joi.string().required(),
    address: Joi.string(),
    area_id: Joi.number().required(),
    type: Joi.string().valid(...allRoles).required(),
    avatar: Joi.string(),
    fees: Joi.when('type', {
        is: 'customer',
        then: Joi.forbidden(),
        otherwise: Joi.number(),
    }),

    specializations: Joi.when('type', {
        is: "customer",
        then: Joi.forbidden(),
        otherwise: Joi.array().items(Joi.number())
    })
})

const createUserBuAdmin = Joi.object({
    email: Joi.string().email().min(5).max(50),
    password: Joi.string().min(6).required()
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()])[A-Za-z\d!@#$%^&*()]{8,}$/)
        .required().messages({
            'string.pattern.base': 'كلمة السر يجب ان تحتوى على حروف وارقام و رموز',
        }),
    first_name: Joi.string().trim().max(50).required(),
    last_name: Joi.string().trim().max(50).required(),
    phone: Joi.string().regex(/^(201|01|00201)[0-2,5]{1}[0-9]{8}/).message("invalid phone").required(),
    gender: Joi.string().required(),
    address: Joi.string().allow(""),
    area_id: Joi.number().required(),
    city: Joi.number().required(),
    type: Joi.string().valid(...allRoles, "admin").required(),
    avatar: Joi.string().allow(null).allow(""),
    phone_verified_at: Joi.date().allow(null).allow(""),
    fees: Joi.when('type', {
        is: 'customer',
        then: Joi.forbidden(),
        otherwise: Joi.number().required(),
    }),

    specializations: Joi.when('type', {
        is: "customer",
        then: Joi.forbidden(),
        otherwise: Joi.array().items(Joi.number()).required()
    }),
    status: Joi.string().valid("active", "not active"),
    languages: Joi.when('type', {
        is: "customer",
        then: Joi.forbidden(),
        otherwise: Joi.array().items(Joi.string().allow(""))
    }),
    bio: Joi.string().allow(""),
    numOfExperience: Joi.when('type', {
        is: "customer",
        then: Joi.forbidden(),
        otherwise: Joi.number().required()
    }),
    cardImages: Joi.when('type', {
        is: "customer",
        then: Joi.forbidden(),
        otherwise: Joi.array().items(Joi.string().allow("")).required()
    }),
    idImages: Joi.when('type', {
        is: "customer",
        then: Joi.forbidden(),
        otherwise: Joi.array().items(Joi.string()).required()
    })
})

const loginSchema = Joi.object({
    phone: Joi.string().regex(/^(201|01|00201)[0-2,5]{1}[0-9]{8}/).message("invalid phone").required(),
    password: Joi.string().min(6).max(50).required()
})

const updateProfile = Joi.object({
    type: Joi.forbidden(),
    password: Joi.string().min(6)
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()])[A-Za-z\d!@#$%^&*()]{8,}$/),
    email: Joi.string().email().min(5).max(50).trim(),
    first_name: Joi.string().trim().max(50),
    last_name: Joi.string().trim().max(50),
    phone: Joi.string().regex(/^(201|01|00201)[0-2,5]{1}[0-9]{8}/).message("invalid phone"),
    gender: Joi.string(),
    address: Joi.string().allow(null).allow(""),
    avatar: Joi.string().allow(null).allow(""),
    area: Joi.number(),
    fees: Joi.number(),
    specializations: Joi.array().items(Joi.number()),
    status: Joi.string().valid("active", "not active"),
    languages: Joi.string(),
    bio: Joi.string(),
    numOfExperience: Joi.number(),
    cardImages: Joi.array().items(Joi.string().allow("")),
    idImages: Joi.array().items(Joi.string()),
    firebaseToken: Joi.string().allow(""),
    phone_verified_at: Joi.date().allow(null).allow("")

}).unknown().custom((value, helpers) => {
    if (Object.keys(value).length === 0) {
        return helpers.error('object.empty');
    }
    return value;
}).messages({
    'object.empty': 'عفوا يجب ارسال اى بيانات للتحديث',
});


const completeProfile = Joi.object({
    fees: Joi.number().required(),
    specializations: Joi.array().items(Joi.number()).required(),
    status: Joi.string().valid("active", "not active"),
    title: Joi.string().required(),
    languages: Joi.array().items(Joi.string().allow("")),
    bio: Joi.string().allow(""),
    numOfExperience: Joi.number().required()
    // cardImages: Joi.array().items(Joi.string()).required(),
    // idImages: Joi.array().items(Joi.string()).required(),

}).unknown().custom((value, helpers) => {
    if (Object.keys(value).length === 0) {
        return helpers.error('object.empty');
    }
    return value;
}).messages({
    'object.empty': 'عفوا يجب ارسال اى بيانات للتحديث',
});

const changePasswordSchema = Joi.object({
    current_password: Joi.string().min(6).max(50).required(),
    new_password: Joi.string().min(6)
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()])[A-Za-z\d!@#$%^&*()]{8,}$/)
        .required().messages({
            'string.pattern.base': 'كلمة السر يجب ان تحتوى على حروف وارقام و رموز',
        })
})

const forgetPasswordSchema = Joi.object({
    phone: Joi.string().regex(/^(201|01|00201)[0-2,5]{1}[0-9]{8}/).message("invalid phone").required()
})

const verifyOtpSchema = Joi.object({
    otp: Joi.string().min(4).required(),
    phone: Joi.string().regex(/^(201|01|00201)[0-2,5]{1}[0-9]{8}/).message("invalid phone").required()
})

const resendOtpSchema = Joi.object({
    phone: Joi.string().regex(/^(201|01|00201)[0-2,5]{1}[0-9]{8}/).message("invalid phone").required()
})

const gatRtc = Joi.object({
    expirationTime: Joi.number().min(10).required(),
    appointmentID: Joi.string().required(),
    type: Joi.string().valid("publisher", "subscriber").required()
})

const update = Joi.object({
    is_active: Joi.boolean(),
})

module.exports = {
    signUpSchema,
    createUserBuAdmin,
    loginSchema,
    updateProfile,
    changePasswordSchema,
    forgetPasswordSchema,
    verifyOtpSchema,
    resendOtpSchema,
    completeProfile,
    gatRtc,
    update
}