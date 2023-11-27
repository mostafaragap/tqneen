const { lawyerNotFoundError, cantAcceptError, cantCancelError } = require("../constants/errorMessages")
const { OK, BAD_REQUEST, NOT_FOUND } = require("../constants/status-codes")
const appointmentService = require("../services/appointment")
const userService = require("../services/user")
const { CustomError } = require("../utils/error")

const create = async (req, res, next) => {
  try {
    const locale = req.headers['locale']
    let { id, body } = req
    let lawyerCheck = await userService.getById(body.lawyer)
    if (!lawyerCheck || lawyerCheck.type != "lawyer" || lawyerCheck.status != "active" || !lawyerCheck.isCompleteProfile) throw new CustomError(lawyerNotFoundError[locale], BAD_REQUEST)
    let appointment = await appointmentService.create({ ...body, fees: lawyerCheck.fees, customer: id })
    return res.status(OK).send(appointment)
  } catch (error) {
    next(error)
  }
}


const update = async (req, res, next) => {
  try {
    const { id } = req.params
    const locale = req.headers['locale']
    let { body } = req
    const user = await userService.getById(+req.id)

    if (user.type == "customer" && (body.status == "accepted" || body.status == "rejected")) throw new CustomError(cantAcceptError[locale], BAD_REQUEST)
    let getAppointment = await appointmentService.getOneByQuery({ id: +id })
    if (user.type == "lawyer" && body.status == "canceled") throw new CustomError(cantCancelError[locale], BAD_REQUEST)
    if (getAppointment.status == "completed" && body.status == "canceled") throw new CustomError(cantCancelError[locale], BAD_REQUEST)

    let appointment = await appointmentService.update(id, body)
    return res.status(OK).send(appointment)
  } catch (error) {
    next(error)
  }
}

const getByid = async (req, res, next) => {
  try {
    const { id } = req
    const appointmentId = req.params.id
    let appointment = await appointmentService.getById(+appointmentId, +id)
    if (!appointment) throw new CustomError("Not Found", NOT_FOUND)
    return res.status(OK).send(appointment)
  } catch (error) {
    next(error)
  }
}

const getAll = async (req, res, next) => {
  try {
    const { id } = req
    const { status, from, to, page } = req.query
    let checkIfCustomerOrLawyer = await userService.getById(+id)

    let query = buildAppointmentQuery(checkIfCustomerOrLawyer.id, checkIfCustomerOrLawyer.type, { status, from, to })
    let appointment = await appointmentService.getAll(query, +page)
    return res.status(OK).send(appointment)
  } catch (error) {
    next(error)
  }
}







module.exports = {
  create,
  update,
  getByid,
  getAll
}


function buildAppointmentQuery(id, type, filters) {
  const query = {};

  if (type === 'customer') {
    query.customer = id; // Filter by the logged-in customer's ID
  } else if (type === 'lawyer') {
    query.lawyer = id; // Filter by the logged-in lawyer's ID
  }

  if (filters.status) {
    query.status = filters.status;
  }

  if (filters.from && filters.to) {
    // Assuming 'from' and 'to' are date ranges
    query.createdAt = {
      $gte: new Date(filters.from),
      $lte: new Date(filters.to),
    };
  }

  return query;
}
