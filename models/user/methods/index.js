module.exports = function (userSchema) {
  userSchema.methods.generateAuthToken = require("./generate-token");
  require("./hide-user-sensitive-data")(userSchema);
};
