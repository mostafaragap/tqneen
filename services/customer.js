
let Lawyer = require("../models/user")
let Appointment = require("../models/appointment/index")


const getActiveLawyers = (page, query) => {
  let agg = generateAgg(query)
  let aggregateBulign = Lawyer.aggregate(agg);
  let pagination = { page: page || 1, limit: 15 }
  return Lawyer.aggregatePaginate(aggregateBulign, pagination);
}

let getAllAppointemnts = (customer) => {
  let query = { is_active: true, customer, status: { $in: ["pending", 'approved'] } }
  let agg = appointmentAgg(query)
  return Appointment.aggregate(agg);
}


module.exports = {
  getActiveLawyers,
  getAllAppointemnts
}

let appointmentAgg = (match) => {
  return [
    {
      '$match': match
    }, {
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
        'localField': 'lawyer',
        'foreignField': 'id',
        'as': 'lawyer'
      }
    }, {
      '$unwind': {
        'path': '$lawyer',
        'preserveNullAndEmptyArrays': true
      }
    },
    {
      '$lookup': {
        'from': 'areas',
        'localField': 'lawyer.area',
        'foreignField': 'id',
        'as': 'lawyer.area'
      }
    },
    {
      '$lookup': {
        'from': 'specializations',
        'localField': 'lawyer.specializations',
        'foreignField': 'id',
        'as': 'lawyer.specializations'
      }
    },
    {
      '$lookup': {
        'from': 'cities',
        'localField': 'lawyer.area.city',
        'foreignField': 'id',
        'as': 'lawyer.area.city'
      }
    },
    {
      '$unwind': {
        'path': '$specification',
        'preserveNullAndEmptyArrays': true
      }
    },
    {
      '$unwind': {
        'path': '$lawyer.area',
        'preserveNullAndEmptyArrays': true
      }
    },
    {
      '$unwind': {
        'path': '$lawyer.area.city',
        'preserveNullAndEmptyArrays': true
      }
    }, {
      '$unwind': {
        'path': '$topic',
        'preserveNullAndEmptyArrays': true
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

let generateAgg = (query) => {
  return [
    {
      $match: query
    },
    {
      '$lookup': {
        'from': 'areas',
        'localField': 'area',
        'foreignField': 'id',
        'as': 'area'
      }
    }, {
      '$unwind': {
        'path': '$area',
        'preserveNullAndEmptyArrays': true
      }
    },
    {
      '$lookup': {
        'from': 'cities',
        'localField': 'area.city',
        'foreignField': 'id',
        'as': 'area.city'
      }
    }, {
      '$unwind': {
        'path': '$area.city',
        'preserveNullAndEmptyArrays': true
      }
    },
    {
      $lookup: {
        from: 'specializations',
        let: { specializationIds: '$specializations' },
        pipeline: [
          {
            $match: {
              $expr: { $in: ['$id', '$$specializationIds'] },
            },
          },
          {
            $lookup: {
              from: 'topics',
              localField: 'id',
              foreignField: 'specialization',
              as: 'topics',
            },
          },
        ],
        as: 'specializations',
      },
    },
    {
      $project: { password: 0, otp: 0 }
    }
  ]
}