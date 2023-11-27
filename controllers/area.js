const areaService = require("../services/area")
const { NOT_FOUND, BAD_REQUEST, UNAUTHORIZED, OK, CONFLICT, INTERNAL_SERVER_ERROR } = require("../constants/status-codes");
const { CustomError } = require("../utils/error");
const { areaExist } = require("../constants/errorMessages");

const create = async (req, res, next) => {
    try {
        let { body } = req
        const locale = req.headers['locale']
        const checkIfExist = await areaService.getOneByQuery({ $or: [{ 'name.ar': body.name.ar }, { 'name.en': body.name.en.toLowerCase() }], is_active: true })
        if (checkIfExist) throw new CustomError(areaExist[locale], CONFLICT)
        const area = await areaService.create(body);
        return res.send({ success: true, area })
    } catch (error) {
        next(error)
    }
}

const getAll = async (req, res, next) => {
    try {

        const areas = await areaService.getAll({ is_active: true });
        return res.send({ success: true, data: areas })
    } catch (error) {
        next(error)
    }
}

const getSingle = async (req, res, next) => {
    try {
        const { id } = req.params
        const area = await areaService.getById(+id);
        if (!area) throw new CustomError("Error While get area date", BAD_REQUEST)
        return res.send({ success: true, data: area })
    } catch (error) {
        next(error)
    }
}

const update = async (req, res, next) => {
    try {
        const { id, body } = req
        const areaId = req.params.id
        const area = await areaService.update(+areaId, body);
        return res.status(OK).send({ success: true, data: area })
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