const supertest = require("supertest")
const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const app = require("../app")
const Blog = require("../models/blog")
const User = require("../models/user")
const helper = require("../utils/api_test_helper")
const api = supertest(app)
const logger = require("../utils/logger")


//before each --
// delete all users, create new account (api.post("/api/users"))
// login (api.post("/api/login")) and declare auth token so its avaiable in scope of all tests 
// create array of blog object promises with auth token attached, promise.all


//declared for global scope
let token;

beforeEach(async ()=>{
    //delete all users, create new and save to db
    await User.deleteMany()
    const passwordHash = await bcrypt.hash("testing123", 10)
    const userForTests = new User ({
        username:"Amanda HuginKiss",
        name:"Amanda",
        passwordHash
    })
    //saves user, gets new user object from db and saves id
    const newUser = await userForTests.save({new:true})
    const userId = newUser._id

    //updates all blogs to have new userid property
    const updatedBlogs = helper.blogsAtStart.map(blog =>
        ({...blog, user: userId}))
    //logs in with user creds and saves token - available through variable declared globally above
    const result = await api
        .post("/api/login")
        .send({username:"Amanda HuginKiss", password:"testing123"})

    token = ("Bearer ").concat(result.body.token)
    //deletes all blogs, takes updated blogs and saves to promise array
    await Blog.deleteMany()
    const blogObjects = updatedBlogs.map(blog =>
        new Blog(blog)
        )
    const promiseArray = blogObjects.map(object =>
        object.save()
        )
    //awaits resolution of all promises saved to array - could access returned value array by saving to variable
    await Promise.all(promiseArray)
})

describe("blogs that are saved in the database ", ()=>{

    test("are all returned in json format", async ()=>{
        const result = await api
        .get("/api/blogs")
        .expect(200)
        .expect("Content-Type", /application\/json/)
    
        expect(result.body).toHaveLength(helper.blogsAtStart.length)
    })

    test("have a unique identifying property, id, which exists for each blog", async() =>{
        const ids = await helper.fetchId()
    
        expect(ids).toBeDefined()
    })

    test("can be deleted", async () =>{
        const blogsAtStart = await helper.blogsFromDb()
        const idToDelete = (blogsAtStart.map(blog => blog.id))[0]

        const result = await api
            .delete(`/api/blogs/${idToDelete}`)
            .set("Authorization", token)
            .expect(204)

        const blogsAtEnd = await helper.blogsFromDb()
        expect(blogsAtEnd).toHaveLength(blogsAtStart.length - 1)
    })
})

describe("when sending new blogs, ", () =>{

    test("sending POST request increases number of blogs in DB by one", async () =>{
        const blogObject = (helper.newBlog)
        await api.post("/api/blogs")
            .send(blogObject)
            .set("Authorization", token)
            .expect(201)
            .expect("Content-Type", /application\/json/)
    
        const blogsAtEnd = await helper.blogsFromDb()
        expect(blogsAtEnd).toHaveLength(helper.blogsAtStart.length + 1)
    })
    
    test("likes default to 0 if not present already", async () =>{
        const blogObjectNoLikes = 
        {
            title: "no likes",
            author: "James",
            url: "http:localhost:6969"
        }

        const result = await api.post("/api/blogs")
            .send(blogObjectNoLikes)
            .set("Authorization", token)
            .expect(201)
            .expect("Content-Type", /application\/json/)   
        
        const body = result.body
        expect(body.likes).toEqual(0)
    })
    
    test("if title and url are missing from new blog, status 400 is returned", async () =>{
        const blogNoTitle = {
            author:"James",
            likes:"10"
        }
        const blogObject = new Blog(blogNoTitle)

        await api.post("/api/blogs")
            .set("Authorization", "bearer ")
            .send(blogObject)
            .expect(401)
    })
})


describe("when updating the likes on a note ", () =>{

    test("updated note and 200 status are returned", async ()=>{
        
        const blogsAtStart = await helper.blogsFromDb()
        const blogToUpdate = blogsAtStart[0]
        const originalLikes = blogToUpdate.likes
        blogToUpdate.likes = blogToUpdate.likes + 1

        const result = await api.put(`/api/blogs/${blogToUpdate.id}`)
            .send(blogToUpdate)
            .expect(200)
            .expect("Content-Type", /application\/json/)

        
        expect(result.body.likes).toEqual(originalLikes + 1)
    })
    
    test("number of notes in database remains the same", async ()=>{
        const blogsAtStart = await helper.blogsFromDb()
        const blogToUpdate = blogsAtStart[0]
        blogToUpdate.likes = blogToUpdate.likes + 1

        await api.put(`/api/blogs/${blogToUpdate.id}`)
            .send(blogToUpdate)
        

        const blogsAtEnd = await helper.blogsFromDb()
        expect(blogsAtStart).toHaveLength(blogsAtEnd.length)
    })
})



afterAll(()=>{
    logger.info('closing connection'),
    
    mongoose.connection.close()
})