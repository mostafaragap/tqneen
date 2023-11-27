const Specialization = require("../models/specialization")

const create = async (body) => {
    const specialization = await Specialization.create(body)
    return specialization
}

const getAll = async (query) => {
    let agg = generateAggregate(query)
    const specializations = await Specialization.aggregate(agg)
    return specializations
}

const getById = async (id) => {
    let agg = generateAggregate({ id })
    const specialization = await Specialization.aggregate(agg)
    return specialization[0]
}

const getOneByQuery = async (query) => {
    let agg = generateAggregate(query)
    const specialization = await Specialization.aggregate(agg)
    return specialization[0] || null
}

const update = async (id, body) => {
    const specialization = await Specialization.findOneAndUpdate({ id }, body, { new: true })
    return specialization
}


let generateAggregate = (query) => {
    let match = { ...query }
    let agg = [
        {
            $match: match
        },

        {
            $lookup: {

                from: "topics",
                let: { specialization_id: "$id" },
                pipeline: [
                    {
                        $match:
                        {
                            $expr:
                            {
                                $and:
                                    [
                                        { $eq: ["$specialization", "$$specialization_id"] },
                                        { $eq: ["$is_active", true] }
                                    ]
                            }
                        }
                    },
                ],
                as: "topics"
            }
        }
    ]
    return agg
}

module.exports = {
    create,
    getAll,
    getById,
    update,
    getOneByQuery
}