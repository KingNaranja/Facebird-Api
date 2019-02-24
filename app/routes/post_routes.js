'use strict'

// Express docs: http://expressjs.com/en/api.html
const express = require('express')
// Passport docs: http://www.passportjs.org/docs/
const passport = require('passport')

// pull in Mongoose model for posts
const Post = require('../models/post')

// we'll use this to intercept any errors that get thrown and send them
// back to the client with the appropriate status code
const handle = require('../../lib/error_handler')

// this is a collection of methods that help us detect situations when we need
// to throw a custom error
const customErrors = require('../../lib/custom_errors')

// we'll use this function to send 404 when non-existant document is requested
const handle404 = customErrors.handle404
// we'll use this function to send 401 when a user tries to modify a resource
// that's owned by someone else
const requireOwnership = customErrors.requireOwnership

// passing this as a second argument to `router.<verb>` will make it
// so that a token MUST be passed for that route to be available
// it will also set `res.user`
const requireToken = passport.authenticate('bearer', { session: false })

// instantiate a router (mini app that only handles routes)
const router = express.Router()

// INDEX
// GET /posts
router.get('/posts', requireToken, (req, res) => {
  // Finds all posts, allows the client to access nickname through the owner,
  // and then sorts posts by reverse created Date
  Post.find().populate('owner', 'nickname').sort('-createdAt')
    .then(posts => {
      // `posts` will be an array of Mongoose documents
      // we want to convert each one to a POJO, so we use `.map` to
      // apply `.toObject` to each one
      return posts.map(post => {
        // possible moment js to reformat creation date.
        // let time = post['createdAt']
        // moment currently undefined since moment.js has not been installed.
        // post['createdAt'] = moment(time).format('MMMM Do YYYY, h:mm:ss a')
        return post.toObject()
      })
    })
    // respond with status 200 and JSON of the posts
    .then(posts => res.status(200).json({ posts: posts }))
    // if an error occurs, pass it to the handler
    .catch(err => handle(err, res))
})

// SHOW ALL POSTS OF SPECIFIC USER
// GET ALL OF MY POSTS
// GET /posts/user
router.get('/posts/myPosts', requireToken, (req, res) => {
  Post.find().populate('owner', 'nickname').sort('-createdAt')
    .then(posts => {
      // console.log(posts)
      const myPosts = []
      posts.forEach(post => {
        // checks to see if the post owner'id matches that of the requesting user
        // if so, adds it to the myPosts array.
        if (req.user._id.equals(post.owner._id)) {
          // console.log(`searcher is `, req.user._id)
          // console.log(`post owner is `, post.owner)
          // console.log(`I added this postto an array`, post)
          myPosts.push(post)
        }
      })
      // `posts` will be an array of Mongoose documents
      // we want to convert each one to a POJO, so we use `.map` to
      // apply `.toObject` to each one

      // returns the array, after changing all the posts to objects (though it's not really needed).
      return myPosts.map(post => post.toObject())
    })
    // respond with status 200 and JSON of the posts
    .then(posts => res.status(200).json({ posts: posts }))
    // if an error occurs, pass it to the handler
    .catch(err => handle(err, res))
})

// SHOW MY LATEST POST
// GET ALL OF MY POSTS
// GET /posts/user
router.get('/posts/myLatestPost', requireToken, (req, res) => {
  Post.find().populate('owner', 'nickname').sort('-createdAt')
    .then(posts => {
      // console.log(posts)
      const post = posts.find(post => {
        if (req.user._id.equals(post.owner._id)) {
          return post
          // console.log(`searcher is `, req.user._id)
          // console.log(`post owner is `, post.owner)
          // console.log(`I added this postto an array`, post)
        }

        // `posts` will be an array of Mongoose documents
        // we want to convert each one to a POJO, so we use `.map` to
        // apply `.toObject` to each one
      })
      return post
    })
  // respond with status 200 and JSON of the posts
    .then(post => res.status(200).json({ post: post }))
  // if an error occurs, pass it to the handler
    .catch(err => handle(err, res))
})

// SHOW
// GET /posts/5a7db6c74d55bc51bdf39793
router.get('/posts/:id', requireToken, (req, res) => {
  // req.params.id will be set based on the `:id` in the route
  Post.findById(req.params.id).populate('owner', 'nickname')
    .then(handle404)
    // if `findById` is succesful, respond with 200 and "post" JSON
    .then(post => res.status(200).json({ post: post.toObject() }))
    // if an error occurs, pass it to the handler
    .catch(err => handle(err, res))
})

// CREATE
// POST /posts
router.post('/posts', requireToken, (req, res) => {
  // set owner of new post to be current user
  req.body.post.owner = req.user.id

  Post.create(req.body.post)
    // respond to succesful `create` with status 201 and JSON of new "post"
    .then(post => {
      res.status(201).json({ post: post.toObject() })
    })
    // if an error occurs, pass it off to our error handler
    // the error handler needs the error message and the `res` object so that it
    // can send an error message back to the client
    .catch(err => handle(err, res))
})

// UPDATE
// PATCH /posts/5a7db6c74d55bc51bdf39793
router.patch('/posts/:id', requireToken, (req, res) => {
  // if the client attempts to change the `owner` property by including a new
  // owner, prevent that by deleting that key/value pair
  delete req.body.post.owner

  // before updating post 
  // delete any empty fields sent by client   
  Object.keys(req.body.post).forEach(key => {
    if (req.body.post[key] === '') {
      delete req.body.post[key]
    }
  })

  Post.findByIdAndUpdate(req.params.id, req.body.post, { new: true })
    .then(handle404)
    .then(post => {
      // pass the `req` object and the Mongoose record to `requireOwnership`
      // it will throw an error if the current user isn't the owner
      requireOwnership(req, post)
      // if that succeeded, return the updated post
      res.status(200).json({ post: post })
    })
    // if an error occurs, pass it to the handler
    .catch(err => handle(err, res))
})

// DESTROY
// DELETE /posts/5a7db6c74d55bc51bdf39793
router.delete('/posts/:id', requireToken, (req, res) => {
  Post.findById(req.params.id)
    .then(handle404)
    .then(post => {
      // throw an error if current user doesn't own `post`
      requireOwnership(req, post)
      // delete the post ONLY IF the above didn't throw
      post.remove()
    })
    // send back 204 and no content if the deletion succeeded
    .then(() => res.sendStatus(204))
    // if an error occurs, pass it to the handler
    .catch(err => handle(err, res))
})

module.exports = router
