const userService = require("../services/user")
const { CustomError } = require("../utils/error")
const { CONFLICT, CREATED, INTERNAL_SERVER_ERROR, OK, BAD_REQUEST } = require("../constants/status-codes");
const { generateOtp } = require("../utils/generateOtp");
const { emailError, phoneExistError, successMessage, notVerifyError, phoneError } = require("../constants/errorMessages");
const { sendOtpEgSms } = require("../utils/sendOtpSms");

const signUp = async (req, res, next) => {
    try {
        const { body } = req;
        const { first_name, last_name } = body
        const locale = req.headers['locale']
        let full_name = first_name + " " + last_name
        let otp = process.env.ENVAIROMENT == "dev" ? "1234" : generateOtp(4)

        let user = {}
        if (body.email) {
            let checkEmail = await userService.getOneByQuery({ email: body.email.toLowerCase() })
            if (checkEmail) {
                throw new CustomError(emailError[locale], CONFLICT)
            }
        }
        let checkPhone = await userService.getOneByQuery({ phone: body.phone.trim() })
        if (checkPhone) {
            throw new CustomError(phoneExistError[locale], CONFLICT)
        }
        else {
            user = await userService.create({ ...body, area: body.area_id, otp, full_name })
        }

        let userResponse = user._doc
        delete userResponse.password
        delete userResponse.otp
        if (process.env.ENVAIROMENT == "dev") {
        } else {
            sendOtpEgSms(otp, body.phone)
        }

        return res.status(OK).send({
            "code": OK,
            success: true,
            message: successMessage[locale], data: { ...userResponse, token: user.generateAuthToken() }
        })
    } catch (error) {
        return next(error)
    }
}

const login = async (req, res, next) => {
    try {
        const appType = req.headers['x-application-name']
        const locale = req.headers['locale']
        const { phone, password } = req.body
        let user = await userService.login(phone.trim(), password, appType, locale)
        if (user.phone_verified_at == null) {
            throw new CustomError(notVerifyError[locale], 423)
        }
        if (!user.is_active) throw new CustomError(phoneError[locale], BAD_REQUEST)
        let userResponse = user._doc
        delete userResponse.password
        delete userResponse.otp
        return res.status(OK).json({
            "success": true,
            "code": 200,
            "message": "تم بنجاح", data: { ...userResponse, token: user.generateAuthToken() }
        })
    } catch (error) {
        return next(error)
    }
}


module.exports = {
    signUp,
    login
}
