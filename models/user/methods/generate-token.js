const { sign } = require("jsonwebtoken")

module.exports = function (options = {}) {
  let token = sign({ userId: this._id, type: this.type, id:this.id }, process.env.JWT_SECRET_KEY, options)
  return token
};
