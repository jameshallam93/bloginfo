const mongoose = require("mongoose")
const Blog = require("../models/blog")
const User = require("../models/user")
require("express-async-errors")

const blogsAtStart = [{
    title: "Test blog post",
    author: "James",
    url: "https://localhost:3003",
    likes: 4
    },
    {
    title: "Second blog post",
    author: "James",
    url: "https://localhost:3003",
    likes: 4
    },
    {
    title: "Third blog post - refactored",
    author: "James",
    url: "https://localhost:3003",
    likes: 4
    }
]
const newBlog = {
    title:"This increases db.length by one",
    author:"James the man",
    url:"localhost:300420",
    likes:1000
}

const blogsFromDb = async () =>{
    const result = await Blog.find({})
    return result.map(result =>
        result.toJSON())
}

const usersFromDb = async () =>{
    const users = await User.find({})

    return (users.map(user =>
        user.toJSON()))
}

const fetchId = async() =>{
    const blogs = await blogsFromDb()
    const ids = blogs.map(blog =>
        blog.id
    )
    return ids

}


module.exports = {
    newBlog,
    blogsAtStart,
    blogsFromDb,
    usersFromDb,
    fetchId
}