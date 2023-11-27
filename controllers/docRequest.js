const { requestError } = require("../constants/errorMessages");
const { BAD_REQUEST } = require("../constants/status-codes");
const docRequestService = require("../services/docRequest");
const userService = require("../services/user");
const { CustomError } = require("../utils/error");

const getAll = async (req, res, next) => {
    try {
        const { id, type } = req
        let query = { is_active: true }
        if (type == "lawyer") {
            query.lawyer = +id
            query.status = "pending"
        }

        const request = await docRequestService.getAll(query)
        return res.send(request)
    } catch (error) {
        next(error)
    }
}

const create = async (req, res, next) => {
    try {
        const { id, body } = req
        const locale = req.headers["locale"]
        const checkIfHasRequest = await docRequestService.getOneByQuery({ flag: body.flag, lawyer: +id, is_active: true })
        if (checkIfHasRequest) throw new CustomError(requestError[locale], BAD_REQUEST)
        const request = await docRequestService.create({ ...body, lawyer: +id })
        return res.send(request)
    } catch (error) {
        next(error)
    }
}

const update = async (req, res, next) => {
    try {
        const { body } = req
        const { id } = req.params
        const request = await docRequestService.update(+id, { ...body, is_active: false })
        if (body.status == "accepted") {
            let flag = request.flag
            let updateLawyer = await userService.update(request.lawyer, flag == "idDoc" ? { idImages: request.docs } : { cardImages: request.docs })
            if (updateLawyer.idImages && updateLawyer.cardImages) await userService.update(request.lawyer, { isCompleteProfile: true })
        }
        return res.send(request)
    } catch (error) {
        next(error)
    }
}

module.exports = { getAll, create, update }