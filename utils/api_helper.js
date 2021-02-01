const User = require("../models/user")
const bcrypt = require("bcrypt")

const userApiFunctions = {

    validateBody (body, response) {

    if (body.password.length < 3){
        return response.status(401).json({error:"password must be at least 3 characters"})

    }else if(body.username.length < 3){
        return response.status(401).json({error:"username must be at least 3 characters"})
    }
    //stand in for truth value (I'm assuming response.status will evaluate to true also)
    return 1
},

    async generateHash(body)  {

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltRounds)

    return passwordHash
},

    async generateUser(body){

    const passwordHash = await userApiFunctions.generateHash(body)

    const newUser = new User({
        username : body.username,
        name : body.name,
        passwordHash : passwordHash
    })
    const result = await newUser.save()
    return result
},

    
}

module.exports = {
    userApiFunctions
}