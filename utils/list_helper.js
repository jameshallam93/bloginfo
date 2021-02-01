
const _ = require("lodash")


const dummy = (array) =>{
    return 1
}
const totalLikes = (array) =>{
    
    if (array.length === 0){
        return 0
    }else{
        const reducer = (totalLikes, blogPost) =>{
            return totalLikes + blogPost.likes
        }
        return array.reduce(reducer,0)
    }
}

const favoriteBlog = (array) =>{

    //must be a way of doing this without empty object constant - why does returning empty object (return {})  evaluate to a string?
    const empty = {}
    let favorite = {
        likes:-1
    }
    array.map(blog =>{
        if (blog.likes > favorite.likes){
            favorite = blog
        }
    })
    if (favorite.likes === -1){
        return empty
    }
    return favorite
}

const indexOfGreatest = (array) =>{

     const returnIndex = array.reduce((maxIndex, currentValue, currentIndex, arrayObject) =>{
        return (currentValue > arrayObject[maxIndex]?
            currentIndex :
            maxIndex
        )},0
    )
    return returnIndex
}


const mostBlogs = (array) =>{

    //not sure why I can't make this work with one object in place of two arrays - _.bymax?
    let authors = []
    let numberOfBlogs = []


    array.map(blog =>{
        if (!authors.includes(blog.author)){
            authors.push(blog.author)
            numberOfBlogs.push(1)  

        }else if(authors.includes(blog.author)){
            const index = authors.indexOf(blog.author)
            numberOfBlogs[index] = numberOfBlogs[index] + 1
    }})

    if (authors.length === 0){
        return {error: "List contains no blogs"}

    }else if(authors.length === 1){
        return {
            author: authors[0],
            blogs: numberOfBlogs[0]
        }
    }
    const index = indexOfGreatest(numberOfBlogs)

    return {
        author: authors[index],
        blogs: numberOfBlogs[index]
    }
}

const mostLikes = (array) =>{
    let authors = []
    let numberOfLikes = []

    //populate authors and number of likes
    array.map(blog =>{
        let author = blog.author
        let likes = blog.likes
        let index = authors.indexOf(author)
        
        if (!(authors.includes(author))){
            authors.push(author)
            numberOfLikes.push(likes)
        }else{
            numberOfLikes[index] = numberOfLikes[index] + likes
        }
    })
    
    //handle lists with zero or one author
    if (authors.length === 0){
        return {error: "List contains no blogs"}
    }else if(authors.length === 1){
        return {
            author: authors[0],
            likes: numberOfLikes[0]
        }
    }

    const index = indexOfGreatest(numberOfLikes)
 
    return {
        author: authors[index],
        likes: numberOfLikes[index]
    }
}


module.exports = {dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes}