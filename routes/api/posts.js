const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

//Post model
const Post = require("../../models/Post");

//Profile model
const Profile = require("../../models/Profile");

//Validation
const validatePostInput = require("../../validation/post");

router.get("/test", (req, res) => res.json({ msg: "posts works" }));

//Get Posts
router.get('/', (req, res) => {
  Post.find()
  .sort({date: -1})
  .then(posts => res.json(posts))
  .catch(err => res.status(404).json({nopostfound: 'No posts found'}))
})

//Get Post by id
// api/post/:id
router.get('/:id', (req, res) => {
  Post.findById(req.params.id)
  .sort({date: -1})
  .then(post => res.json(post))
  .catch(err => res.status(404).json({nopostfound: 'No post found with that ID'}))
})

//Create POST
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);

    //check validation
    if (!isValid) {
      //if any errors
      return res.status(400).json(errors);
    }

    const newPost = new Post({
      text: req.body.text,
      name: req.body.name,
      avatar: req.body.avatar,
      user: req.body.user
    });
    newPost.save().then(post => res.json(post));
  }
);

//Delete Post
// api/posts/:id
router.delete('/:id', passport.authenticate('jwt', { session:false }), (req, res) => {
  Profile.findOne({ user: req.user.id})
  .then(profile => {
    Post.findById(req.params.id)
    .then(post => {
      //Check for post owner
      if(post.user.toString() !== req.user.id) {
        return res.status(401).json({notauthorized: 'User not authorized'})
      }
      //Delete
      post.remove().then(()=> res.json({ success: true}))
    })
    .catch(err => res.status(404).json({ postnotfound: 'No post found' }))
  })
})

module.exports = router;
