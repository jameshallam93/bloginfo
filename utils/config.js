require("dotenv").config()

let MONGO_DB_URL = process.env.MONGODB_URL


if (process.env.NODE_ENV === "test"){
    
    MONGO_DB_URL = process.env.MONGODB_TEST_URL

}

const PORT = process.env.PORT

module.exports = {PORT, MONGO_DB_URL}