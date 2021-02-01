const express = require('express')
require("express-async-errors")
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')

const middleware = require("./utils/middleware")
const blogRouter = require("./controllers/blogs")
const userRouter = require("./controllers/users")
const loginRouter = require("./controllers/login")
const config = require("./utils/config")
const logger = require("./utils/logger")



const connect = async () =>{
  logger.info(`connecting to database ${config.MONGO_DB_URL}`)
  await mongoose.connect(config.MONGO_DB_URL, {useFindAndModify:false, useCreateIndex:true, useUnifiedTopology:true, useNewUrlParser:true})
}
connect()

app.use(cors())
app.use(express.static("build"))
app.use(express.json())
app.use(middleware.getToken)
app.use(middleware.requestLogger)

app.use("/api/users", userRouter)
app.use("/api/blogs", blogRouter)
app.use("/api/login", loginRouter)

app.use(middleware.errorHandler)
app.use(middleware.unknownEndpoint)



module.exports = app