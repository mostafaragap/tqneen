const userService = require("./services/user")

const insertAdminIfNotExist = async() => {
    try {
        const checkIfExist = await userService.getOneByQuery({type : "admin"})
        if(!checkIfExist) {
            const insertAdmin = await userService
              .create({type: "admin", full_name: "admin admin" ,first_name :"admin", last_name:"admin" 
              , email :"admin@tqneen.com" , password : "M@m12345", })
        }
    } catch (error) {
        console.log(error);
    }
}
insertAdminIfNotExist()