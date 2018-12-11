const express = require("express");
const gravatar = require("gravatar");
const key = require("../../config/keys").secretOrKey;
const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const router = express.Router();

//@route    GET api/user/test
//@desc     Tests user route
//@access   Public
router.get("/test", (req, res) => res.json({ msg: "Users works" }));

//@route    GET api/user/register
//@desc     Resgiter user route
//@access   Public
router.post("/register", (req, res) => {
  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      return res.status(400).json({ email: "Email already exists" });
    } else {
      const avatar = gravatar.url(req.body.email, {
        s: "200", //Size
        r: "pg", //Rating
        d: "mm" //Default
      });
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        avatar,
        password: req.body.password
      });
      //generate salt and hash password
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(req.body.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
});

//@route    GET api/user/login
//@desc     Login user / return JWT token
//@access   Public
router.post("/login", (req, res) => {
  User.findOne({ email: req.body.email }).then(user => {
    // check email
    if (!user) {
      return res.status(404).json({ email: "User not found" });
    }
    //check password
    bcrypt.compare(req.body.password, user.password).then(isMatch => {
      if (isMatch) {
        // create JWT payload
        const payload = { id: user.id, name: user.name, avatar: user.avatar };
        //sign the token
        jwt.sign(payload, key, { expiresIn: 3600 }, (err, token) => {
          res.json({
            success: true,
            token: "Bearer " + token
          });
        });
      } else {
        res.status(400).json({ password: "Wrong password" });
      }
    });
  });
});

//@route    GET api/user/current
//@desc     Resgiter user route
//@access   Private
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email
    });
  }
);
module.exports = router;
