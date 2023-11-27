const userService = require("../services/user")

const login = async (req, res, next) => {
    try {
        const {email, password} = req.body
        const user = await userService.adminLogin(email, password)
        return res.send({user, token: user.generateAuthToken()})
    } catch (error) {
        next(error)   
    }
}

module.exports = {
    login
}