module.exports = function (userSchema) {
    userSchema.methods.toJSON = function () {
        const user = this.toObject()
        delete user.password
        delete user.otp
        return user
    }
};


