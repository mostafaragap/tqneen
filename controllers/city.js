const cityService = require("../services/city")
const { BAD_REQUEST, OK, CONFLICT } = require("../constants/status-codes");
const { CustomError } = require("../utils/error");
const { cityExist } = require("../constants/errorMessages");

const create = async (req, res, next) => {
    try {
        let { body } = req
        const locale = req.headers['locale']
        const checkIfExist = await cityService.getOneByQuery({ $or: [{ 'name.ar': body.name.ar }, { 'name.en': body.name.en.toLowerCase() }], is_active: true })
        if (checkIfExist) throw new CustomError(cityExist[locale], CONFLICT)
        const city = await cityService.create(body);
        return res.send({ success: true, city })
    } catch (error) {
        next(error)
    }
}

const getAll = async (req, res, next) => {
    try {
        const cities = await cityService.getAll({ is_active: true });
        return res.send({ success: true, data: cities })
    } catch (error) {
        next(error)
    }
}

const getSingle = async (req, res, next) => {
    try {
        const { id } = req.params
        const city = await cityService.getById(+id);
        if (!city) throw new CustomError("Error While get city date", BAD_REQUEST)
        return res.send({ success: true, data: city })
    } catch (error) {
        next(error)
    }
}

const update = async (req, res, next) => {
    try {
        const { id, body } = req
        const cityId = req.params.id
        const checkIfExist = await cityService.getOneByQuery({ $or: [{ 'name.ar': body.name.ar }, { 'name.en': body.name?.en.toLowerCase() }], is_active: true })
        if (checkIfExist) throw new CustomError("this city is already exist", CONFLICT)
        const city = await cityService.update(+cityId, body);
        return res.status(OK).send({ success: true, data: city })
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