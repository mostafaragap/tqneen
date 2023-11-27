const customerService = require("../services/customer");
const appointmentService = require("../services/appointment");
const userService = require("../services/user");
const { CustomError } = require("../utils/error");
const { BAD_REQUEST } = require("../constants/status-codes");
const { lawyerNotFoundError } = require("../constants/errorMessages");

const getActiveLawyers = async (req, res, next) => {
  try {
    let { page, gender, search, specification_id, min_fees, max_fees, status } =
      req.query;
    let filters = { gender, search, specification_id, min_fees, max_fees, status };
    let query = generateQuery(filters);
    const activeLawyers = await customerService.getActiveLawyers(page, query);

    let response = {
      code: 200,
      status: true,
      message: "all lawyers response",
      data: activeLawyers.docs,
      pagination: {
        total: activeLawyers.totalDocs,
        per_page: 15,
        current_page: activeLawyers.page,
        total_pages: activeLawyers.totalPages,
      },
    };

    return res.send(response);
  } catch (error) {
    next(error);
  }
};


const getSingleLawyer = async (req, res, next) => {
  try {
    const { id } = req.params
    const locale = req.header('locale')
    const lawyer = await userService.getById(+id)
    if (!lawyer) throw new CustomError(lawyerNotFoundError[locale], BAD_REQUEST)
    return res.send(lawyer)
  } catch (error) {
    next(error)
  }
}


const getHomePage = async (req, res, next) => {
  try {
    let { id } = req;
    const lawyersquery = {
      type: "lawyer",
      status: "active",
      isCompleteProfile: true,
      is_active: true
    }; // Start with the base query

    const lawyers = await customerService.getActiveLawyers(1, lawyersquery);

    let current_appointments = await customerService.getAllAppointemnts(+id);

    return res.send({
      success: true,
      code: 200,
      message: "ok",
      data: {
        current_appointments,
        lawyers: lawyers?.docs,
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getActiveLawyers, getSingleLawyer, getHomePage };

function generateQuery(filters) {
  const query = { type: "lawyer", isCompleteProfile: true, is_active: true }; // Start with the base query

  if (filters.gender) {
    query.gender = filters.gender;
  }

  if (filters.specification_id) {
    query["specializations"] = +filters.specification_id;
  }

  if (filters.min_fees !== undefined) {
    query["fees"] = { $gte: +filters.min_fees };
  }

  if (filters.max_fees !== undefined) {
    query["fees"] = query["fees"] || {}; // Ensure 'fees' is an object
    query["fees"]["$lte"] = +filters.max_fees;
  }

  if (filters.search) {
    const searchRegex = new RegExp(filters.search, "i");
    query.$or = [
      { first_name: searchRegex },
      { last_name: searchRegex },
      { full_name: searchRegex },
    ];
  }

  if (filters.status) {
    query["status"] = filters.status
  }

  return query;
}
