const mongoose = require("mongoose")
const uniqueValidator = require("mongoose-unique-validator")

const userSchema = new mongoose.Schema({
    username:
    {
        type: String,
        required: true,
        unique: true
    },
    name: String,
    passwordHash: {
        type:String
    }
}
)

userSchema.plugin(uniqueValidator)

userSchema.set("toJSON" ,{
    transform:(document, returnedObject) => {
        returnedObject.id = returnedObject._id

        delete returnedObject._id
        delete returnedObject.__v
        delete returnedObject.passwordHash
    }
})

module.exports = new mongoose.model("User", userSchema)