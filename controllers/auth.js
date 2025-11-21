const passport = require("passport");
const validator = require("validator");
const User = require("../models/User");
const DummySite = require("../models/DummySite");

exports.getLogin = (req, res) => {
  if (req.user) {
    return res.redirect("/profile");
  }
  res.render("login", {
    title: "Login",
  });
};

exports.postLogin = (req, res, next) => {
  const validationErrors = [];
  if (!validator.isEmail(req.body.email))
    validationErrors.push({ msg: "Please enter a valid email address." });
  if (validator.isEmpty(req.body.password))
    validationErrors.push({ msg: "Password cannot be blank." });

  if (validationErrors.length) {
    req.flash("errors", validationErrors);
    return res.redirect("/login");
  }
  req.body.email = validator.normalizeEmail(req.body.email, {
    gmail_remove_dots: false,
  });

  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      req.flash("errors", info);
      return res.redirect("/login");
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      console.log(user)
      req.flash("success", { msg: "Success! You are logged in." });
      res.redirect(req.session.returnTo || "/profile");
    });
  })(req, res, next);
};

// Had to ask chatGPT about passport.regenerate error to debug this logout. Took almost an hour, but it had to do with the callback syntax changing in later versions of passport.
exports.logout = (req, res) => {
  req.logout(function(err){
    if(err) {console.log(err)}

    console.log('User has logged out.')

    req.session.destroy((err) => {
      if (err)
        console.log("Error : Failed to destroy the session during logout.", err);
      // req.user = null;
      res.redirect("/");
    })
  })
  
};

exports.getSignup = (req, res) => {
  if (req.user) {
    return res.redirect("/profile");
  }
  res.render("signup", {
    title: "Create Account",
  });
};

exports.getAdmin = (req,res) => {
  if (req.user) {
    return res.redirect("/profile");
  }
  res.render("signup_admin", {
    title: "Create Account",
  });
}

exports.postSignup = async (req, res, next) => {
  const validationErrors = [];
  if (!validator.isEmail(req.body.email))
    validationErrors.push({ msg: "Please enter a valid email address." });
  if (!validator.isLength(req.body.password, { min: 8 }))
    validationErrors.push({
      msg: "Password must be at least 8 characters long",
    });
  if (req.body.password !== req.body.confirmPassword)
    validationErrors.push({ msg: "Passwords do not match" });

  if (validationErrors.length) {
    req.flash("errors", validationErrors);
    return res.redirect("../signup");
  }
  req.body.email = validator.normalizeEmail(req.body.email, {
    gmail_remove_dots: false,
  });

  let user

  if (req.body.access === undefined) {
    const userKey = await User.findOne({userName:"User"})
    user = new User({
      userName: req.body.userName,
      email: req.body.email,
      access: userKey._id,
      password: req.body.password
    })
  } else {
    user = new User({
      userName: req.body.userName,
      email: req.body.email,
      access: req.body.access,
      password: req.body.password
    })
  }
  

  console.log('user',user)

  const existingUser = await User.findOne(
    { $or: [{ email: req.body.email }, { userName: req.body.userName }] }
  )
  if (existingUser) {
        req.flash("errors", {
          msg: "Account with that email address or username already exists.",
        });
        return res.redirect("../signup");
      }
  user.save()
  .then(usr => {req.logIn(user, (err) => {
        if (err) {
          return next(err);
        }
        res.redirect("/profile");
      });
  });
};