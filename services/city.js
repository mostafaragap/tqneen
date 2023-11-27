const City = require("../models/city")

const create = async (body) => {
    const city = await City.create({ ...body, name: body.name.toLowerCase() })
    return city
}

const getAll = async (query) => {
    query.is_active = true
    let agg = generateAggregate(query)
    const citys = await City.aggregate(agg)
    return citys
}

const getById = async (id) => {
    let agg = generateAggregate({ id })
    const city = await City.aggregate(agg)
    return city[0]
}

const getOneByQuery = async (query) => {
    let agg = generateAggregate(query)
    const city = await City.aggregate(agg)
    return city[0] || null;
}

const getAllByQuery = async (query) => {
    let agg = generateAggregate(query)
    const citys = await City.aggregate(agg);
    return citys;
}

const update = async (id, body) => {
    const city = await City.findOneAndUpdate({ id }, body, { new: true })
    return city
}


let generateAggregate = (query) => {
    let agg = [
        {
            $match: query
        },
        {
            $lookup: {

                from: "areas", // the collection to join with
                let: { city_id: "$id" }, // Define the local variable to use in the pipeline below
                pipeline: [
                    {
                        $match:
                        {
                            $expr:
                            {
                                $and:
                                    [
                                        { $eq: ["$city", "$$city_id"] }, // Ensure the area belongs to the city
                                        { $eq: ["$is_active", true] } // Filter only active areas
                                    ]
                            }
                        }
                    },
                ],
                as: "areas" // alias for the output array
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