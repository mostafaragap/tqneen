const topicService = require("../services/topic")
const { NOT_FOUND, BAD_REQUEST, UNAUTHORIZED, OK, CONFLICT, INTERNAL_SERVER_ERROR } = require("../constants/status-codes");
const { CustomError } = require("../utils/error");
const { topicExist } = require("../constants/errorMessages");

const create = async (req, res, next) => {
    try {
        let { body } = req
        const locale = req.headers['locale']
        const checkIfExist = await topicService.getOneByQuery({$or : [{ 'name.ar' : body.name.ar},{ 'name.en' : body.name.en.toLowerCase()}] })
        if(checkIfExist) throw new CustomError(topicExist[locale], CONFLICT)
        const topic = await topicService.create(body);
        return res.send({success : true ,topic})
    } catch (error) {
        next(error)
    }
}

const getAll = async (req, res, next) => {
    try {
        const topics = await topicService.getAll({});
        return res.send({success : true ,data: topics})
    } catch (error) {
        next(error)
    }
}

const getSingle = async (req, res, next) => {
    try {
        const { id } = req.params
        const topic = await topicService.getById(+id);
        if (!topic) throw new CustomError("Error While get topic date", BAD_REQUEST)
        return res.send({success : true ,data: topic})
    } catch (error) {
        next(error)
    }
}

const update = async (req, res, next) => {
    try {
        const { id, body } = req
        const topicId = req.params.id
        const topic = await topicService.update(+topicId, body);
        return res.status(OK).send({success : true , data:topic})
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