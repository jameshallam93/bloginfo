const logger = require("./logger")

const requestLogger = (request, response, next) =>{
    logger.info(`method: ${request.method}`)
    logger.info(`path: ${request.path}`)
    logger.info(`body: ${request.body}`)
    logger.info("----------end of request logger----------")
    next()
}

const errorHandler = (error, request, response, next) => {
    logger.error(error.message)

    if (error.name === 'CastError' && error.kind === 'ObjectId') {
        return response.status(400).send({ error: 'malformatted id' })}
    else if (error.name === "MongoParseError") {
        return response.status(400).json({erro :error.message})
    }
    else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    }else if(error.name === "JsonWebTokenError"){
        return response.status(401).send({error:"Invalid token"})
    }
    next(error)
}
// middleware for retrieving token from authorization header and adding it to request object
const getToken = (request, response, next) =>{

    const authorization = request.get("authorization")

    if (authorization && authorization.toLowerCase().startsWith("bearer")){
        request.token = authorization.substring(7)
    }
    next()
}

const unknownEndpoint = (request, response) =>{
    response.status(404).send({error: "unknown endpoint"})}

module.exports = {
    requestLogger,
    errorHandler,
    unknownEndpoint,
    getToken
}