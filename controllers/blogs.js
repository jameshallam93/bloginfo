const blogRouter = require("express").Router()
const Blog = require("../models/blog")
const User = require("../models/user")
const jwt = require("jsonwebtoken")


blogRouter.get("/", async (request, response) =>{
    const result = await Blog.find({})
        .populate("user", {username:1, name:1})
    response.json(result)
})

blogRouter.post("/", async (request, response) =>{
    const body = request.body
    const token = request.token 
    const decodedToken = jwt.verify(token, process.env.SECRET)

    if (!(token || decodedToken.id)){
        response
            .status(401)
            .json({error:"token missing or invalid"})
    }

    const user = await User.findById(decodedToken.id)

    const blogToSave = new Blog({
        "title": body.title,
        "author": body.author,
        "url": body.url,
        "likes": body.likes,
        "user":user._id
    })
    if(blogToSave.title && blogToSave.url){
        const result = await blogToSave.save()
        response.status(201).json(result).end()
    }else{
        response.status(400).end()
    }
})

blogRouter.delete("/:id", async (request, response) =>{

    const id = request.params.id
    
    const token = request.token

    const decodedToken = jwt.verify(token, process.env.SECRET)

    if (!(token || decodedToken.id)){
        response
            .status(400)
            .json({error:"invalid or missing token"})
    }

    const blogToDelete = await Blog.findById(id)


    if (blogToDelete.user.toString() !== decodedToken.id.toString()){
        console.log("Only a blogs author may delete it")
        response.status(401).json({error:"Only user who created note can delete it"})
        return 
    }
    await Blog.findByIdAndDelete(id)
    response.status(204).end()
})

blogRouter.put("/:id", async (request, response) =>{
    
    const body = request.body

    const updatedBlog = {
        title:body.title,
        author:body.author,
        url:body.url,
        likes:body.likes
    }
    const returnedBlog = await Blog.findByIdAndUpdate(request.params.id, updatedBlog, {new: true})
    response.status(200).json(returnedBlog)
})
module.exports = blogRouter