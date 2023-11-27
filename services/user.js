const User = require("../models/user")
const { compare } = require("bcrypt")
const { CustomError } = require("../utils/error")
const { NOT_FOUND, BAD_REQUEST, UNAUTHORIZED } = require("../constants/status-codes")
const { generateOtp } = require("../utils/generateOtp")
const { loginError, changePasswordError, otpError, phoneError, userNotFound } = require("../constants/errorMessages")
const { sendOtpEgSms } = require("../utils/sendOtpSms")
// const { sendVerificationEmail } = require("../utils/sendVerificationEmail")

let populate = []

const create = async (body) => {
  const user = await User.create({
    ...body, email: body.email?.toLowerCase(),
  })
  return user
}

const getAll = async (query) => {
  let agg = generateAgg(query)
  const users = await User.aggregate(agg)
  return users
}


const getById = async (id) => {
  let agg = generateAgg({ id })
  const user = await User.aggregate(agg)
  return user[0] || null
}

const getOneByQuery = async (query) => {
  const user = await User.findOne(query);
  return user;
}

const getAllByQuery = async (query) => {
  const users = await User.find(query);
  return users;
}

const update = async (id, body) => {
  let updateBody = { ...body }

  let updateUser = await User.findOneAndUpdate({ id }, body, { new: true })
  if (body.first_name || body.last_name) {
    updateUser = await User.findOneAndUpdate({ id }, { full_name: updateUser.first_name + " " + updateUser.last_name }, { new: true })
  }
  return updateUser
}

const updateByEmail = async (email, body) => {
  const updateUser = await User.findOneAndUpdate({ email }, body, { new: true }).populate(populate)
  return updateUser
}


const login = async (phone, password, appType, locale) => {
  const user = await getOneByQuery({ phone })
  if (!user) throw new CustomError(loginError[locale], UNAUTHORIZED)

  const ifPasswordMatch = await checkPassword(password, user.password)
  if (!ifPasswordMatch) throw new CustomError(loginError[locale], 400)
  if (user.type !== appType) throw new CustomError(loginError[locale], UNAUTHORIZED)
  return user
}

const adminLogin = async (email, password, locale = "en") => {
  const user = await getOneByQuery({ email, type: "admin" })
  if (!user) throw new CustomError(loginError[locale], UNAUTHORIZED)

  const ifPasswordMatch = await checkPassword(password, user.password)
  if (!ifPasswordMatch) throw new CustomError(loginError[locale], 400)
  return user
}

const changePassword = async (id, data, locale) => {
  const { current_password, new_password } = data
  const userHashedPassword = await User.findById(id).select('password')

  const ifPasswordMatch = await checkPassword(current_password, userHashedPassword.password)
  if (!ifPasswordMatch) throw new CustomError(changePasswordError[locale], 400)

  let user = await update(id, { password: new_password })
  return user
}

const verifyOtp = async (phone, otp, locale) => {
  const user = await getOneByQuery({ phone })
  if (!user) throw new CustomError(phoneError[locale], BAD_REQUEST)

  if (otp != user.otp) throw new CustomError(otpError[locale], BAD_REQUEST)

  return update(user.id, { $unset: { otp: "" }, phone_verified_at: Date.now() })
}

const forgetPassword = async (phone, locale, appType) => {
  let user = await getOneByQuery({ phone })
  if (!user) throw new CustomError(phoneError[locale], BAD_REQUEST)
  if (user.type !== appType) throw new CustomError(userNotFound[locale], UNAUTHORIZED)

  let otp = process.env.ENVAIROMENT == "dev" ? "1234" : generateOtp(4)
  if (process.env.ENVAIROMENT == "dev") {
  } else {
    sendOtpEgSms(otp, phone)
  }
  await update(user.id, { otp })
  // await sendVerificationEmail(email, otp)
  return true
}

const resetPassword = async (id, password, locale) => {
  let user = await getOneByQuery({ phone })
  if (!user) throw new CustomError(phoneError[locale], 400)

  await update(id, { password })
  return true
}

const checkPassword = (current_password, userHashedPassword) => {
  return compare(current_password, userHashedPassword)
}

const generateAgg = (match) => {
  return [
    {
      $match: match
    },
    {
      '$lookup': {
        'from': 'areas',
        'localField': 'area',
        'foreignField': 'id',
        'as': 'area'
      }
    }, {
      '$unwind': {
        'path': '$area',
        'preserveNullAndEmptyArrays': true
      }
    }, {
      '$lookup': {
        'from': 'cities',
        'localField': 'area.city',
        'foreignField': 'id',
        'as': 'city'
      }
    }, {
      '$unwind': {
        'path': '$city',
        'preserveNullAndEmptyArrays': true
      }
    },
    {
      $lookup: {
        from: "specializations",
        localField: "specializations",
        foreignField: "id",
        as: "specializations"
      }
    },
    {
      $project: {
        password: 0,
        otp: 0
      }
    }
  ]
}
module.exports = {
  create,
  getAll,
  getById,
  login,
  adminLogin,
  getAllByQuery,
  getOneByQuery,
  update,
  updateByEmail,
  changePassword,
  forgetPassword,
  verifyOtp,
  resetPassword
}

