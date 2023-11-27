const DocRequest = require("../models/docRequests")

const create = async (body) => {
    const docReq = await DocRequest.create(body)
    return docReq
}

const getAll = async (query) => {
    let agg = generateAggregate(query)
    const docReqs = await DocRequest.aggregate(agg)
    return docReqs
}

const getById = async (id) => {
    let agg = generateAggregate({ id })
    const docReq = await DocRequest.aggregate(agg)
    return docReq[0] || null
}

const getOneByQuery = async (query) => {
    let agg = generateAggregate(query)
    const docReq = await DocRequest.aggregate(agg)
    return docReq[0] || null;
}

const getAllByQuery = async (query) => {
    let agg = generateAggregate(query)
    const areas = await DocRequest.aggregate(agg);
    return areas;
}

const update = async (id, body) => {
    const area = await DocRequest.findOneAndUpdate({ id }, body, { new: true })
    return area
}

let generateAggregate = (query) => {
    let agg = [
        {
            $match: query
        },
        {
            $lookup: {
                from: "users",
                localField: "lawyer",
                foreignField: "id",
                as: "lawyer"
            }
        },
        {
            $unwind: {
                path: "$lawyer",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $project: {
                'lawyer.password': 0,
                'lawyer.otp': 0,
            }
        },
        {
            $sort: { createdAt: -1 }
        }
    ]
    return agg
}

module.exports = {
    create,
    getAll,
    getById,
    getAllByQuery,
    getOneByQuery,
    update
}