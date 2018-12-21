const express = require("express");
const router = express.Router();
const passport = require("passport");

//load models
const Profile = require("../../models/Profile");
const User = require("../../models/User");

// Load Validation
const validateProfileInput = require("../../validation/profile");
const validateExperienceInput = require("../../validation/experience");
const validateEducationInput = require("../../validation/education");

//@route    GET api/profile/test
//@desc     Tests profile route
//@access   Public
router.get("/test", (req, res) => res.json({ msg: "Profiles works" }));

//@route    GET api/profile
//@desc     Get current user profile
//@access   Private
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};
    Profile.findOne({ user: req.user.id })
      .populate("user", ["name", "avatar"])
      .then(profile => {
        if (!profile) {
          errors.noprofile = "There is no profile for this user";
          return res.status(404).json(errors);
        }
        res.json(profile);
      })
      .catch(err => res.status(404).json(err));
  }
);

//@route    POST api/profile
//@desc     Create/update current user profile
//@access   Private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateProfileInput(req.body);
    if (!isValid) {
      return res.status(404).json(errors);
    }
    // Get fields
    const profileFields = {};
    profileFields.user = req.user.id;
    if (req.body.handle) profileFields.handle = req.body.handle;
    if (req.body.company) profileFields.company = req.body.company;
    if (req.body.website) profileFields.website = req.body.website;
    if (req.body.location) profileFields.location = req.body.location;
    if (req.body.bio) profileFields.bio = req.body.bio;
    if (req.body.status) profileFields.status = req.body.status;
    if (req.body.githubusername)
      profileFields.githubusername = req.body.githubusername;
    // Skills - Spilt into array
    if (typeof req.body.skills !== "undefined") {
      profileFields.skills = req.body.skills.split(",");
    }
    //social
    if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
    if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
    if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
    if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
    if (req.body.instagram) profileFields.social.instagram = req.body.instagram;

    Profile.findOne({ user: req.user.id })
      .then(profile => {
        if (profile) {
          //update profile
          Profile.findOneAndUpdate(
            { user: req.user.id },
            { $set: profileFields },
            { new: true }
          ).then(profile => {
            res.json(profile);
          });
        } else {
          // Create profile
          // Check if handle exists
          Profile.findOne({ handle: profileFields.handle }).then(profile => {
            if (profile) {
              errors.handle = "That handle already exists";
              res.status(400).json(errors);
            }
            // Save Profile
            new Profile(profileFields)
              .save()
              .then(profile => res.json(profile));
          });
        }
      })
      .catch(err => res.json(err));
  }
);

//@route    POST api/profile/experience
//@desc     Add experience
//@access   Private
router.post(
  "/experience",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateExperienceInput(req.body);
    if (!isValid) {
      return res.status(404).json(errors);
    }
    Profile.findOne({ user: req.user.id }).then(profile => {
      const newExp = {
        title: req.body.title,
        company: req.body.company,
        location: req.body.location,
        from: req.body.from,
        to: req.body.to,
        current: req.body.current,
        description: req.body.description
      };
      //Add newExp to the user profile
      profile.experience.unshift(newExp);
      //Save the profile
      profile.save().then(profile => res.json(profile));
    });
  }
);

//@route    POST api/profile/education
//@desc     Add education
//@access   Private
router.post(
  "/education",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateEducationInput(req.body);
    if (!isValid) {
      return res.status(404).json(errors);
    }
    Profile.findOne({ user: req.user.id }).then(profile => {
      const newEdu = {
        school: req.body.school,
        degree: req.body.degree,
        fieldofstudy: req.body.fieldofstudy,
        from: req.body.from,
        to: req.body.to,
        current: req.body.current,
        description: req.body.description
      };
      //Add newEdu to the profile
      profile.education.unshift(newEdu);
      //Save the profile
      profile.save().then(profile => res.json(profile));
    });
  }
);

//@route    DELETE api/profile/experience/:exp_id
//@desc     Delete experience from profile
//@access   Private
router.post(
  "/experience/:exp_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        //Get the index of experience form the array
        const removeIndex = profile.experience
          .map(item => item.id)
          .indexOf(req.params.exp_id);
        //remove the experience
        profile.experience.splice(removeIndex, 1);
        //save the profile
        profile.save().then(profile => res.json(profile));
      })
      .catch(err => res.status(404).json(err));
  }
);

//@route    DELETE api/profile/education/:edu_id
//@desc     Delete education from profile
//@access   Private
router.post(
  "/education/:edu_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        //Get the index of experience form the array
        const removeIndex = profile.experience
          .map(item => item.id)
          .indexOf(req.params.edu_id);
        //remove the experience
        profile.experience.splice(removeIndex, 1);
        //save the profile
        profile.save().then(profile => res.json(profile));
      })
      .catch(err => res.status(404).json(err));
  }
);

// @route   DELETE api/profile
// @desc    Delete user and profile
// @access  Private
router.delete(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    //remove profile
    Profile.findOneAndRemove({ user: req.user.id }).then(() => {
      //remove user
      User.findOneAndRemove({ _id: req.user.id }).then(() =>
        res.json({ success: true })
      );
    });
  }
);

//@route    GET api/profile/handel/:handle
//@desc     Get profile by handle
//@access   Public
router.get("/handle/:handle", (req, res) => {
  const errors = {};
  Profile.findOne({ handle: req.params.handle })
    //join user details
    .populate("users", ["name", "avatar"])
    .then(profile => {
      if (!profile) {
        errors.noprofile = "There is no profile for this user";
        return res.status(404).json(errors);
      }
      res.json(profile);
    })
    .catch(err =>
      res.status(400).json({ profile: "There is no profile for this user" })
    );
});

//@route    GET api/profile/user/:user_id
//@desc     Get profile by user_id
//@access   Public
router.get("/user/:user_id", (req, res) => {
  const errors = {};
  Profile.findOne({ handle: req.params.user_id })
    //join user details
    .populate("users", ["name", "avatar"])
    .then(profile => {
      if (!profile) {
        errors.noprofile = "There is no profile for this user";
        return res.status(404).json(errors);
      }
      res.json(profile);
    })
    .catch(err =>
      res.status(400).json({ profile: "There is no profile for this user" })
    );
});

//@route    GET api/profile/all
//@desc     Get all profiles
//@access   Public
router.get("/all", (req, res) => {
  const errors = {};
  Profile.find()
    //join user details
    .populate("users", ["name", "avatar"])
    .then(profile => {
      if (!profile) {
        errors.noprofile = "There are no profile";
        return res.status(404).json(errors);
      }
      res.json(profile);
    })
    .catch(err => res.status(400).json({ profile: "There are no profile" }));
});

module.exports = router;
