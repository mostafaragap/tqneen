const Area = require("../models/area")

const create = async (body) => {
    const area = await Area.create(body)
    return area
}

const getAll = async (query) => {
    query.is_active = true
    let agg = generateAggregate(query)
    const areas = await Area.aggregate(agg)
    return areas
}

const getById = async (id) => {
    let agg = generateAggregate({id})
    const area = await Area.aggregate(agg)
    return area[0]
}

const getOneByQuery = async (query) => {
    let agg = generateAggregate(query)
    const area = await Area.aggregate(agg)
    return area[0];
}

const getAllByQuery = async (query) => {
    let agg = generateAggregate(query)
    const areas = await Area.aggregate(agg);
    return areas;
}

const update = async (id, body) => {
    const area = await Area.findOneAndUpdate({ id }, body, { new: true })
    return area
}

let generateAggregate = (query) => {
    let agg = [
        {
            $match : query
        },
        {
            $lookup : {
                    from: "cities",
                    localField: "city",
                    foreignField: "id",
                    as: "city"
                  }  
        },
        {
            $unwind : {
                path : "$city",
                preserveNullAndEmptyArrays : true
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