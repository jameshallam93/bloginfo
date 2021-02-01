const bcrypt = require("bcrypt")
const User = require("../models/user")
const userRouter = require("express").Router()
const helper = require("../utils/api_helper").userApiFunctions




userRouter.post("/", async (request, response) =>{
    const body = request.body
    //breaks out of function if username/password less than 3 chars, returns status code
    if (helper.validateBody(body, response) !== 1){
        return
    }
    //generateUser invokes generateHash to create password hash inside itself
    const result = await helper.generateUser(body)

    response.json(result)
})

userRouter.get("/", async (request, response) =>{
    const users = await User.find({})

    response.status(200).json(users)
})

module.exports = userRouter