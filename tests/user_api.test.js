const User = require("../models/user")
const supertest = require("supertest")
const app = require("../app")
const api = supertest(app)
const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const helper = require("../utils/api_test_helper")

const newUser = {
    username:"BigBoyBen",
    name:"Benjamin",
    password:"ostriches"
}
const existingUser = {
    username: "BigCheese",
    name: "Martha",
    password:"existing"
}
beforeEach(async ()=>{
    await User.deleteMany({})
    const passwordHash = await bcrypt.hash("remember", 10)
    const userToSave = new User({
        username:"BigCheese",
        name:"Tomas",
        passwordHash: passwordHash
    })
    await userToSave.save()
}
)

describe("when there is one user in the database ",() =>{

    test("valid user can be added", async () =>{
        const usersAtStart = await helper.usersFromDb()

        const result = await api.post("/api/users")
            .send(newUser)
            .expect(200)
            .expect("Content-Type", /application\/json/)
    
        const usersAtEnd = await helper.usersFromDb()
    
        expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)
    
        const usernames = usersAtEnd.map(user =>
            user.username)
        expect(usernames).toContain("BigBoyBen")
    })
    
    test("a user with an existing username will return status 400", async ()=>{

        await api.post("/api/users")
        .send(existingUser)
        .expect(400)
        .expect("Content-Type", /application\/json/)
    
    })
})

afterAll(async () =>{
    await mongoose.connection.close()})