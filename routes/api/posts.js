const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

//Post model
const Post = require("../../models/Post");

//Validation
const validatePostInput = require("../../validation/post");

router.get("/test", (req, res) => res.json({ msg: "posts works" }));

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

module.exports = router;
