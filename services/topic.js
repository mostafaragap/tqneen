const Topic = require("../models/topic")

const create = async (body) => {
    const topic = await Topic.create(body)
    return topic
}

const getAll = async (query) => {
    query.is_active = true
    let agg = generateAggregate(query)
    const topics = await Topic.aggregate(agg)
    return topics
}

const getById = async (id) => {
    let agg = generateAggregate({id})
    const topic = await Topic.aggregate(agg)
    return topic[0]
}

const getOneByQuery = async (query) => {
    let agg = generateAggregate(query)
    const topic = await Topic.aggregate(agg)
    return topic[0];
}

const getAllByQuery = async (query) => {
    let agg = generateAggregate(query)
    const topics = await Topic.aggregate(agg);
    return topics;
}

const update = async (id, body) => {
    const topic = await Topic.findOneAndUpdate({ id }, body, { new: true })
    return topic
}

let generateAggregate = (query) => {
    let agg = [
        {
            $match : query
        },
        {
            $lookup : {
                    from: "specializations",
                    localField: "specialization",
                    foreignField: "id",
                    as: "specialization"
                  }  
        },
        {
            $unwind : {
             path : "$specialization",
            'preserveNullAndEmptyArrays': true
            }
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