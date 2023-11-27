let Appointment = require("../models/appointment/index")

const create = async (body) => {
  const appointment = await Appointment.create(body)
  return appointment
}

//filter by status
const getAll = async (query = {}, page = 1) => {
  query.is_active = true
  let agg = generateAgg(query)
  let aggregateBulign = Appointment.aggregate(agg);
  let pagination = { page: page || 1, limit: 15 }
  return Appointment.aggregatePaginate(aggregateBulign, pagination);
}

const getById = async (id, userId) => {
  let agg = generateAgg({ id: +id, $or: [{ customer: userId }, { lawyer: userId }] })

  const appointment = await Appointment.aggregate(agg);
  return appointment[0]
}

const getOneByQuery = async (query) => {
  const appointment = await Appointment.findOne(query);
  return appointment;
}

const getAllByQuery = async (query) => {
  const appointment = await Appointment.find(query);
  return appointment;
}

const update = async (id, body) => {
  const updateAppointment = await Appointment.findOneAndUpdate({ id }, body, { new: true })
  return updateAppointment
}

// aggregateeeeeeeeeeeeeeeeeeeeeeee

let generateAgg = (match) => {
  return [
    {
      '$match': match
    },
    {
      '$lookup': {
        'from': 'specializations',
        'localField': 'specification',
        'foreignField': 'id',
        'as': 'specification'
      }
    }, {
      '$lookup': {
        'from': 'topics',
        'localField': 'topic',
        'foreignField': 'id',
        'as': 'topic'
      }
    }, {
      '$lookup': {
        'from': 'users',
        'localField': 'customer',
        'foreignField': 'id',
        'as': 'customer'
      }
    }, {
      '$lookup': {
        'from': 'users',
        'localField': 'lawyer',
        'foreignField': 'id',
        'as': 'lawyer'
      }
    }, {
      '$unwind': {
        'path': '$customer',
        'preserveNullAndEmptyArrays': true
      }
    }, {
      '$unwind': {
        'path': '$lawyer',
        'preserveNullAndEmptyArrays': true
      }
    }, {
      '$unwind': {
        'path': '$specification',
        'preserveNullAndEmptyArrays': true
      }
    }, {
      '$unwind': {
        'path': '$topic',
        'preserveNullAndEmptyArrays': true
      }
    }, {
      '$lookup': {
        'from': 'areas',
        'let': {
          'area': '$customer.area'
        },
        'pipeline': [
          {
            '$match': {
              '$expr': {
                '$and': [
                  {
                    '$eq': [
                      '$id', '$$area'
                    ]
                  }
                ]
              }
            }
          }
        ],
        'as': 'customer.area'
      }
    }, {
      '$unwind': {
        'path': '$customer.area',
        'preserveNullAndEmptyArrays': true
      }
    }, {
      '$lookup': {
        'from': 'cities',
        'let': {
          'cityId': '$customer.area.city'
        },
        'pipeline': [
          {
            '$match': {
              '$expr': {
                '$eq': [
                  '$id', '$$cityId'
                ]
              }
            }
          }
        ],
        'as': 'customer.area.city'
      }
    }, {
      '$unwind': {
        'path': '$customer.area.city',
        'preserveNullAndEmptyArrays': true
      }
    },
    {
      '$lookup': {
        'from': 'areas',
        'let': {
          'area': '$lawyer.area'
        },
        'pipeline': [
          {
            '$match': {
              '$expr': {
                '$and': [
                  {
                    '$eq': [
                      '$id', '$$area'
                    ]
                  }
                ]
              }
            }
          }
        ],
        'as': 'lawyer.area'
      }
    }, {
      '$unwind': {
        'path': '$lawyer.area',
        'preserveNullAndEmptyArrays': true
      }
    }, {
      '$lookup': {
        'from': 'cities',
        'let': {
          'cityId': '$lawyer.area.city'
        },
        'pipeline': [
          {
            '$match': {
              '$expr': {
                '$eq': [
                  '$id', '$$cityId'
                ]
              }
            }
          }
        ],
        'as': 'lawyer.area.city'
      }
    }, {
      '$unwind': {
        'path': '$lawyer.area.city',
        'preserveNullAndEmptyArrays': true
      }
    },
    {
      '$lookup': {
        'from': 'specializations',
        'localField': 'lawyer.specializations',
        'foreignField': 'id',
        'as': 'lawyer.specializations'
      }
    }, {
      '$project': {
        'customer.password': 0,
        'lawyer.password': 0,
        'lawyer.otp': 0,
      }
    }
  ]
}

module.exports = {
  create,
  getAll,
  getById,
  getOneByQuery,
  getAllByQuery,
  update
}