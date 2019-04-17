const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const passport = require('passport')

const Post = require('../../models/Post')

router.get('/test', (req, res) => res.json({msg: 'posts works'}))

//Create POST
router.post('/', passport.authenticate('jwt', {session: false}), (req, res) => {
    const newPost = newPost({
        text: req.body.text,
        name: req.body.name,
        avatar: req.body,avatar,
        user: req.body.user
    });
    newPost.save().then(post => res.json(post))
})


module.exports = router