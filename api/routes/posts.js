const router = require('express').Router();
const Post = require('../models/Post.js');
const User = require('../models/User.js');

// Create A Post 

router.post("/", async (req, res) => {
    const newPost = await new Post(req.body)
    try {
        const savedPost = await newPost.save();
        res.status(200).json(savedPost);
    } catch (error) {
        res.status(500).json(error)
    }
});

// Update A Post 

router.put("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (req.body.userId === post.userId) {
            try {
                await post.updateOne({ $set: req.body });
                res.status(200).json("Your post has been updated!");
            } catch (error) {
                res.status(500).json(error);
            }
        } else {
            res.status(403).json("You can only update Your own post!");
        };
    } catch (error) {
        res.status(500).json(error);
    }
});

// Delete A Post 

router.delete("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (post.userId === req.body.userId) {
            try {
                await post.deleteOne();
                res.status(200).json("Your post has been deleted!");
            } catch (error) {
                res.status(500).json(error);
            }
        } else {
            res.status(403).json("You can delete only your own post!");
        }
    } catch (error) {
        res.status(500).json(error);
    }
});

// Like or Dislike A Post

router.put("/:id/like", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (req.body.userId !== post.userId) {
            if (!post.likes.includes(req.body.userId)) {
                await post.updateOne({ $push: { likes: req.body.userId } });
                res.status(200).json("The post has been liked!");
            } else {
                await post.updateOne({ $pull: { likes: req.body.userId } });
                res.status(200).json("The post has been disliked!");
            }
        } else {
            res.status(403).json("You cannot like your own post!");
        }
    } catch (error) {
        res.status(500).json(error);
    }
});

// Get A Post 

router.get("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json(error);
    }
});

// Get timeline(Post of the people whom user follows) Posts 

router.get("/timeline/:userId", async (req, res) => {
    try {
        const currentUser = await User.findById(req.params.userId);
        const currentUserPosts = await Post.find({ userId: currentUser._id });
        const freindPosts = await Promise.all(
            currentUser.followings.map((freindId) => {
                return Post.find({ userId: freindId });
            })
        );
        res.status(200).json(currentUserPosts.concat(...freindPosts));
    } catch (error) {
        res.status(500).json(error)
    }
});

// Get User's all posts 

router.get("/profile/:username", async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username });
        const posts = await Post.find({ userId: user._id })
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json(error);
    }
});

module.exports = router;