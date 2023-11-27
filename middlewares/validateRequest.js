const { invalidPhoneError, invalidEmailError } = require("../constants/errorMessages");
const { UNPROCESSABLE_ENTITY } = require("../constants/status-codes")

exports.validateRequestBody = (schema) => {
  return async (req, res, next) => {
    const { error } = schema.validate(req.body);
    req.get("locale")
    const locale = req.headers['locale']
    if (error) {
      const errors = {};


      (error.details).forEach((err) => {

        const path = err.path[0];
        let message = ''
        if (err?.message == 'invalid phone') {
          message = invalidPhoneError[locale]
        } else {
          message = err.message;
        }

        errors[path] = [message];
      });

      let errMessage = ''
      if (error.details[0].context.key == "phone") errMessage = invalidPhoneError[locale]
      else if (error.details[0].context.key == "email") errMessage = invalidEmailError[locale]
      else errMessage = error.details[0].message
      return res.status(UNPROCESSABLE_ENTITY).json({
        success: false, message: errMessage,
        data: {
          errors
        }
      });
    }
    else {
      return next();
    }

  };
};

exports.validateRequestQuery = (schema) => {
  return async (req, res, next) => {
    if (req.query.page && !isNaN(req.query.page)) req.query.page = +req.query.page
    if (req.query.limit && !isNaN(req.query.limit)) req.query.limit = +req.query.limit

    const { error } = schema.validate(req.query);
    if (error) {
      const errors = {};

      (error.details).forEach((err) => {
        const path = err.path[0];
        const message = err.message;
        errors[path] = [message];
      });

      return res.status(UNPROCESSABLE_ENTITY).json({
        success: false, message: error.details[0].message,
        data: {
          errors
        }
      });
    }
    return next();
  };
};

exports.validateRequestParams = (schema) => {
  return async (req, res, next) => {
    if (req.params['0']) delete req.params['0']
    const { error } = schema.validate(req.params);
    if (error) {
      const errors = {};

      (error.details).forEach((err) => {
        const path = err.path[0];
        const message = err.message;
        errors[path] = [message];
      });

      return res.status(UNPROCESSABLE_ENTITY).json({
        success: false, message: error.details[0].message,
        data: {
          errors
        }
      });
    }
    return next();
  };
};