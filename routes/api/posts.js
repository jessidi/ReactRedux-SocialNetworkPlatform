const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

const Post = require("../../models/Post");
const Profile = require("../../models/Profile");

const validatePostInput = require("../../validation/post");

// @route    GET api/posts/test
// @desc     Tests posts route
// @access   Public
router.get("/test", (req, res) => res.json({ msg: "Post test good" }));

// @route    POST api/posts/
// @desc     Create post
// @access   Private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }
    const newPost = new Post({
      text: req.body.text,
      name: req.body.name,
      avatar: req.body.avatar,
      user: req.user.id
    });
    newPost.save().then(post => res.json(post));
  }
);

// @route    GET api/posts/
// @desc     Get post
// @access   Private
router.get("/", (req, res) => {
  Post.find()
    .sort({ date: -1 })
    .then(posts => res.json(posts))
    .catch(err => res.status(404).json({ nopostsfound: "No posts found" }));
});

// @route    GET api/posts/:id
// @desc     Get post by id
// @access   Private
router.get("/:id", (req, res) => {
  Post.findById(req.params.id)
    .then(post => res.json(post))
    .catch(err =>
      res.status(404).json({ nopostfound: "No post found with that Id" })
    );
});

// @route    DELETE api/posts/:id
// @desc     Delete post by id
// @access   Private
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        Post.findById(req.params.id).then(post => {
          // Check for post owner
          if (post.user.toString() !== req.user.id) {
            return res
              .status(401)
              .json({ notauthorized: "User not authorized" });
          }

          //Delete
          post.remove().then(() => res.json({ success: true }));
        });
      })
      .catch(err =>
        res.status(404).json({ postnotfound: "No post found with that Id" })
      );
  }
);

// @route    POST api/posts/like/:id
// @desc     Like the post
// @access   Private
router.post(
  "/like/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        Post.findById(req.params.id).then(post => {
          // Get the post that will be liked
          if (
            post.likes.filter(like => like.user.toString() === req.user.id)
              .length > 0
          ) {
            return res
              .status(400)
              .json({ alreadyLiked: "User already liked this post" });
          }

          // Add the user id to likes array
          post.likes.unshift({ user: req.user.id });
          post.save().then(post => res.json(post));
        });
      })
      .catch(err =>
        res.status(404).json({ postnotfound: "No post found with that Id" })
      );
  }
);

// @route    POST api/posts/unlike/:id
// @desc     Unlike the post
// @access   Private
router.post(
  "/unlike/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        Post.findById(req.params.id).then(post => {
          // Get the post that will be unliked
          if (
            post.likes.filter(like => like.user.toString() === req.user.id)
              .length === 0
          ) {
            return res
              .status(400)
              .json({ notLiked: "You have not yet liked this post" });
          }

          // Remove the user id from likes array
          const removeIndex = post.likes
            .map(like => like.user.toString())
            .indexOf(req.user.id);
          post.likes.splice(removeIndex, 1);

          // Save the post
          post.save().then(post => res.json(post));
        });
      })
      .catch(err =>
        res.status(404).json({ postnotfound: "No post found with that Id" })
      );
  }
);

// @route    POST api/posts/comment/:id
// @desc     Add comment to the post
// @access   Private

router.post(
  "/comment/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }

    Post.findById(req.params.id)
      .then(post => {
        const newComment = {
          text: req.body.text,
          name: req.body.name,
          avatar: req.body.avatar,
          user: req.user.id
        };

        // Add to comments array
        post.comments.unshift(newComment);
        post.save().then(post => res.json(post));
      })
      .catch(err => res.status(404).json({ postNotFound: "No post found" }));
  }
);

// @route    DELETE api/posts/comment/:id/:comment_id
// @desc     Remove comment from post
// @access   Private

router.delete(
  "/comment/:id/:commentId",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Post.findById(req.params.id)
      .then(post => {
        // Add to comments array
        if (
          post.comments.filter(
            comment => comment._id.toString() === req.params.commentId
          ).length === 0
        ) {
          return res
            .status(404)
            .json({ commentNotExists: "Comment does not exists" });
        }

        // Get remove index
        const removeIndex = post.comments
          .map(comment => comment._id.toString())
          .indexOf(req.params.commentId);
        post.comments.splice(removeIndex, 1);
        post.save().then(post => res.json(post));
      })
      .catch(err => res.status(404).json({ postNotFound: "No post found" }));
  }
);

module.exports = router;
