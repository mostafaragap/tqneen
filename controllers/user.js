const userService = require("../services/user");
const { BAD_REQUEST, UNAUTHORIZED, OK, CONFLICT, INTERNAL_SERVER_ERROR } = require("../constants/status-codes");
const uuid = require("uuid");
const { CustomError } = require("../utils/error");
const {
  userNotFound,
  emailError,
  phoneExistError,
  otpSentSuccess,
  successMessage,
  callError,
} = require("../constants/errorMessages");


const { RtcTokenBuilder, RtcRole } = require("agora-access-token");

const getProfile = async (req, res, next) => {
  const { userId } = req;
  try {
    const locale = req.headers["locale"];
    const user = await userService.getOneByQuery({ _id: userId, active: true });
    if (!user) throw new CustomError(userNotFound[locale], UNAUTHORIZED);
    return res.send(user);
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  const { id } = req;
  try {
    const locale = req.headers["locale"];
    if (req.body.email) {
      let checkEmail = await userService.getOneByQuery({
        id: { $ne: id },
        email: req.body.email.trim(),
      });
      if (checkEmail) throw new CustomError(emailError[locale], CONFLICT);
    }
    if (req.body.phone) {
      let checkPhone = await userService.getOneByQuery({
        id: { $ne: id },
        phone: req.body?.phone.trim(),
      });
      if (checkPhone) throw new CustomError(phoneExistError[locale], CONFLICT);
    }
    const user = await userService.update(id, req.body);
    if (!user) throw new CustomError("Error While get user date", BAD_REQUEST);
    return res.send(user);
  } catch (error) {
    next(error);
  }
};

const completeProfile = async (req, res, next) => {
  try {
    const locale = req.headers["locale"];
    const { id } = req;
    const { body } = req;
    const lawyer = await userService.update(+id, {
      ...body,
      isCompleteProfile: true
    });
    return res.send(lawyer);
  } catch (error) {
    next(error);
  }
};

const changePassword = async (req, res, next) => {
  try {
    const { userId, body } = req;
    const locale = req.headers["locale"];
    const user = await userService.changePassword(userId, body, locale);
    return res.status(OK).send(user);
  } catch (error) {
    next(error);
  }
};

const forgetPassword = async (req, res, next) => {
  try {
    const { phone } = req.body;
    const locale = req.headers["locale"];
    const appType = req.headers["x-application-name"];
    const sendOtp = await userService.forgetPassword(phone, locale, appType);

    if (sendOtp != true) throw new CustomError("error", INTERNAL_SERVER_ERROR);
    return res.status(OK).send({
      success: true,
      message: otpSentSuccess[locale],
      data: [],
    });
  } catch (error) {
    next(error);
  }
};

const verifyOtp = async (req, res, next) => {
  try {
    const { phone, otp } = req.body;
    const locale = req.headers["locale"];
    const user = await userService.verifyOtp(phone, otp, locale);
    return res.status(OK).send({
      code: OK,
      success: true,
      message: successMessage[locale],
      data: { ...user._doc, token: user.generateAuthToken() },
    });
  } catch (error) {
    next(error);
  }
};

const resendOtp = async (req, res, next) => {
  try {
    const { phone } = req.body;
    const locale = req.headers["locale"];
    const user = await userService.getOneByQuery({ phone: phone.trim() });
    if (!user) throw new CustomError(userNotFound[locale], BAD_REQUEST);
    let otp = process.env.ENVAIROMENT == "dev" ? "1234" : generateOtp(4)
    await userService.update(user.id, { otp })
    if (process.env.ENVAIROMENT == "dev") {
    } else {
      sendOtpEgSms(otp, phone)
    }

    return res.status(OK).send({
      success: true,
      code: 200,
      message: otpSentSuccess[locale],
      data: [],
    });
  } catch (error) {
    next(error);
  }
};

const decreaseNumOfFree = async (req, res, next) => {
  try {
    let { id } = req
    const locale = req.headers["locale"] || "en"
    const getUserFree = await userService.getById(+id)
    if (getUserFree.freeTrialCount < 1) throw new CustomError(callError[locale], BAD_REQUEST)
    const decreaseFree = await userService.update(+id, { $inc: { freeTrialCount: -1 } })
    return res.send({ message: "updated successfully", decreaseFree })
  } catch (error) {
    next(error)
  }
}

const deleteMyAccount = async (req, res, next) => {
  const { userId } = req;
  try {
    const user = await userService.update(userId, { active: false });
    if (!user)
      throw new CustomError(
        "Error while delete your account",
        INTERNAL_SERVER_ERROR
      );
    return res.status(OK).send(user);
  } catch (error) {
    return next(error);
  }
};

const genRTCToken = async (req, res, next) => {
  try {
    res.header("Access-Control-Allow-Origin", "*");
    const { expirationTime, appointmentID, type } = req.body;

    let role = RtcRole.SUBSCRIBER;
    if (type === "publisher") {
      role = RtcRole.PUBLISHER;
    }

    const currrntTime = Math.floor(Date.now() / 1000);
    const priviligeDuration = +expirationTime + currrntTime;
    let uid = uuid.v4();
    let channelName = `${appointmentID}`;

    const token = RtcTokenBuilder.buildTokenWithUid(
      process.env.AGORA_PROJECT_ID, // app id
      process.env.AGORA_CERTIFICATE, // app certifcate
      channelName, // channel name
      0, // uid
      role, // role
      priviligeDuration
    );

    if (!token) {
      return res.status(400).json({ message: "error while creating token" });
    }
    return res.status(201).json({ token, uid, channelName });
  } catch (error) {
    next(error);
  }
};

// Admin
const createUser = async (req, res, next) => {
  const { body } = req;
  const locale = req.headers["locale"] || 'en';

  try {
    if (body.email) {
      let checkEmail = await userService.getOneByQuery({ email: body.email });
      if (checkEmail) throw new CustomError(emailError[locale], CONFLICT);
    }

    let checkphone = await userService.getOneByQuery({ phone: body.phone });
    if (checkphone) throw new CustomError(phoneExistError[locale], CONFLICT);
    const full_name = body.first_name + " " + body.last_name
    if (body.type == 'lawyer') body.isCompleteProfile = true
    const user = await userService.create({ ...body, area: body.area_id, full_name });

    return res.status(OK).send(user);
  } catch (error) {
    next(error);
  }
};

const updateUserByadmin = async (req, res, next) => {
  const { userId } = req.params;
  const body = req.body;
  const locale = 'en'
  try {
    if (body.email) {
      let checkEmail = await userService.getOneByQuery({ id: { $ne: +userId }, email: req.body.email.trim(), });
      if (checkEmail) throw new CustomError(emailError[locale], CONFLICT);
    }
    if (body.phone) {
      let checkphone = await userService.getOneByQuery({ id: { $ne: +userId }, phone: body.phone });
      if (checkphone) throw new CustomError(phoneExistError[locale], CONFLICT);
    }

    const user = await userService.update(+userId, body);
    if (!user) throw new CustomError("user not found", BAD_REQUEST);
    return res.status(OK).send(user);
  } catch (error) {
    next(error);
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    const { type } = req.query;
    let query = {};
    if (type) query.type = type;
    const users = await userService.getAll(query);
    return res.status(OK).send(users);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  changePassword,
  forgetPassword,
  verifyOtp,
  decreaseNumOfFree,
  updateProfile,
  completeProfile,
  createUser,
  updateUserByadmin,
  getAllUsers,
  deleteMyAccount,
  resendOtp,
  genRTCToken,
};
