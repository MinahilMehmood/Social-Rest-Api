const router = require('express').Router();
const User = require("../models/User.js");
const bcrypt = require("bcrypt");

// Update User 

router.put("/:id", async (req, res) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {
        if (req.body.password) {
            try {
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(req.body.password, salt);
            } catch (error) {
                return res.status(500).json(error);
            }
        }
        try {
            const user = await User.findByIdAndUpdate(req.params.id, {
                $set: req.body,
            });
            res.status(200).json("Account has been updated!");
        } catch (error) {
            res.status(500).json(error);
        }
    } else {
        res.status(403).json("You can update only your account!");
    }
});

// Delete User 

router.delete("/:id", async (req, res) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {
        try {
            await User.findByIdAndDelete(req.params.id);
            res.status(200).json("Account has been deleted successfully!");
        } catch (error) {
            res.status(500).json(error);
        }
    } else {
        res.status(403).json("You can only delete your own account!");
    };
});

// Get a User 

router.get("/", async (req, res) => {

    const userId = req.query.userId;
    const username = req.query.username;

    try {
        const user = username ? await User.findOne({ username }) : await User.findById(userId);
        const { password, updatedAt, ...others } = user._doc;
        // const { password, isAdmin, updatedAt, createdAt, ...others } = user._doc; 
        res.status(200).json(others);
    } catch (error) {
        res.status(500).json(error);
    };
});

// Get freinds of users 

router.get("/friends/:userId", async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        const friends = await Promise.all(
            user.followings.map(async (freindId) => {
                return await User.findById(freindId)
            })
        );
        let friendList = [];
        friends.map((friend) => {
            const { _id, username, profilePicture } = friend;
            friendList.push({ _id, username, profilePicture });
        })
        res.status(200).json(friendList);
    } catch (error) {
        res.status(500).json(error)
    }
});

// Follow a User

router.put("/:id/follow", async (req, res) => {
    if (req.body.userId !== req.params.id) {
        try {
            const user = await User.findById(req.body.userId);
            const followedUser = await User.findById(req.params.id);
            if (!followedUser.followers.includes(req.body.userId)) {
                await followedUser.updateOne({ $push: { followers: req.body.userId } });
                await user.updateOne({ $push: { followings: req.params.id } });
                res.status(200).json("User has been followed!");
            } else {
                res.status(403).json("You've already followed this user!");
            }
        } catch (error) {
            res.status(500).json(error);
        };
    } else {
        res.status(403).json("You can't follow yourself, Mister!");
    };
});

// UnFollow User

router.put("/:id/unfollow", async (req, res) => {
    if (req.body.userId !== req.params.id) {
        try {
            const user = await User.findById(req.body.userId);
            const followedUser = await User.findById(req.params.id);
            if (followedUser.followers.includes(req.body.userId)) {
                await user.updateOne({ $pull: { followings: req.params.id } });
                await followedUser.updateOne({ $pull: { followers: req.body.userId } });
                res.status(200).json("User has been unfollowed!");
            } else {
                res.status(403).json("You don't follow this user!");
            }
        } catch (error) {
            res.status(500).json(error);
        }
    } else {
        res.status(403).json("You can't unfollow yourself, Silly!")
    }
});

module.exports = router;