const app = require("../app")
const supertest = require("supertest")
const api = supertest(app)
const mongoose = require("mongoose")
const User = require("../models/user")
const helper = require("../utils/api_test_helper")
const { generateHash, validateBody, generateUser } = require("../utils/api_helper").userApiFunctions
const { userApiFunctions } = require("../utils/api_helper")


beforeEach(async ()=>{
    await User.deleteMany({})
})

const mockResponseGenerator = () => {
    const response = {};
    response.status = jest.fn().mockReturnValue(response);
    response.json = jest.fn().mockReturnValue(response);
    return response;
  };

describe("validate body fuction ", ()=>{

    test("returns 1 with a valid username and password", async ()=>{
        const credentials = {username:"NewUsername", name: "Jessica Rarebit", password: "anaconda"}
        const result = await validateBody(credentials, {})
        expect(result).toBe(1)
    })

    test("returns status code 401 if username is too short", async ()=>{
        const credentials = {username:"ta", name:"Gracias", password:"openme"}
        const mockResponse = mockResponseGenerator()
        await validateBody(credentials, mockResponse)

        expect(mockResponse.status).toHaveBeenCalledWith(401)
    })

    test("returns status code 401 if password too short", async () =>{
        const credentials = {username:"Tammy", name:"Rosie J", password:"js"}
        const mockResponse = mockResponseGenerator()

        await validateBody(credentials, mockResponse)
        expect(mockResponse.status).toHaveBeenCalledWith(401)
    })

    
})
describe("generate hash function ", ()=>{
    test("returns a string", async () =>{
        const credentials = {password: "changeme"}
        const returnedHash = await generateHash(credentials)
        expect(typeof returnedHash).toBe("string")
    })
    
})
describe("the generate user function ", () =>{
    test(" calls generate hash function", async () =>{
        const credentials = {username:"Mikey P", name:"Marvelo", password:"arealpassword"}
        const spy = jest.spyOn(userApiFunctions, "generateHash")
    
        await generateUser(credentials)
        expect(spy).toHaveBeenCalled()
    })

    test("increases the number of users in the database by one", async () =>{
        const usersAtStart = await helper.usersFromDb()
        const credentials = {username:"Mikey H", name:"Marvelo", password:"arealpassword"}
        
        await generateUser(credentials)

        const usersAtEnd = await helper.usersFromDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)
    })
    test("returns an object with new user details present", async ()=>{
        const credentials = {username:"Mikey T", name:"Marvelo", password:"arealpassword"}
        const result = await generateUser(credentials)
        expect(result.username).toBe("Mikey T")
        
    })
    
})



afterAll(()=>{
    mongoose.connection.close()
})