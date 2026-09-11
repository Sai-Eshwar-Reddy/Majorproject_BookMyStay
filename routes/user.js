const express = require("express");
const wrapasync = require("../utils/wrapasync");
const User = require("../models/users.js");
const passport = require("passport");
const router = express.Router();

//Sign up route
router.get("/signup", (req, res) => {
    res.render("users/signup.ejs");
});
router.post(
    "/signup",
    wrapasync(async (req, res) => {
        try {
            const { username, email, password } = req.body;
            const newUser = new User({
                username,
                email
            });
            const registeredUser = await User.register(newUser, password);
            req.flash("success", "Sign up completed successfully!");
            res.redirect("/listings");
        } catch (e) {
            if (e.name === "UserExistsError") {
                req.flash("error", "Username already exists. Please choose another.");
            } else {
                req.flash("error", "Something went wrong. Please try again.");
            }
            res.redirect("/signup");
        }
    })
);

//Login Route
router.get("/login", (req, res) => {
    res.render("users/login.ejs");
    error: req.flash("error")
});

router.post(
    "/login",
    passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: "Incorrect username or password."
    }),
    (req, res) => {
        req.flash("success", "Logged in successfully");
        res.redirect("/listings");
    }
);

module.exports = router;

