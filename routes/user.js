const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/users.js")

router
    .route("/signup").get(userController.userSignUpForm)
    .post(wrapAsync(userController.userSignUpVerification));

router
    .route("/login")
    .get(userController.userLoginForm)
    .post(saveRedirectUrl, passport.authenticate("local", { failureRedirect: "/login", failureFlash: true, }), userController.userLoginVerification);

router.get("/logout", userController.userLogout);

module.exports = router;