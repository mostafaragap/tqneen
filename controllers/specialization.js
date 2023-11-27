const specializationService = require("../services/specialization")
const { NOT_FOUND, BAD_REQUEST, UNAUTHORIZED, OK, CONFLICT, INTERNAL_SERVER_ERROR } = require("../constants/status-codes");
const { CustomError } = require("../utils/error");
const { specialExist } = require("../constants/errorMessages");

const create = async (req, res, next) => {
    try {
        let { body } = req
        const locale = req.headers['locale']
        const checkIfExist = await specializationService.getOneByQuery({ $or: [{ 'name.ar': body.name.ar }, { 'name.en': body.name.en.toLowerCase() }], is_active: true })
        if (checkIfExist) throw new CustomError(specialExist[locale], CONFLICT)
        const specialization = await specializationService.create(body);
        return res.send({ success: true, specialization })
    } catch (error) {
        next(error)
    }
}

const getAll = async (req, res, next) => {
    try {
        const specializations = await specializationService.getAll({});
        return res.send({ success: true, data: specializations })
    } catch (error) {
        next(error)
    }
}

const getSingle = async (req, res, next) => {
    try {
        const { id } = req.params
        const specialization = await specializationService.getById(+id);
        if (!specialization) throw new CustomError("Error While get specialization date", BAD_REQUEST)
        return res.send({ success: true, data: specialization })
    } catch (error) {
        next(error)
    }
}

const update = async (req, res, next) => {
    try {
        const { id, body } = req
        const spId = req.params.id
        const specialization = await specializationService.update(+spId, body);
        return res.status(OK).send({ success: true, data: specialization })
    } catch (error) {
        next(error)
    }
}


module.exports = {
    create,
    getAll,
    getSingle,
    update
}