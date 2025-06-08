if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
};

// console.log(process.env.SECRET)

const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const ExpressError = require("./utils/expressError.js");
const { reviewSchema } = require("./schema.js");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const { error } = require("console");



const dbURL = process.env.ATLASDB_URL

main()
  .then(() => {
    console.log("Connection Successful");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(dbURL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));

const store = MongoStore.create({
  mongoUrl: dbURL,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
});

store.on("error", () => {
  console.log("Error in MONGO SESSION STORE", err);
});

const sessionOptions = {
  store,
  secret : process.env.SECRET,
  resave : false,
  saveUninitialized : true,
  cookie : {
    expires : Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly : true,
  },
};

// app.get("/", (req, res) => {
//   res.send("Hi, I am root");
// });



app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

// app.get("/demouser", async (req, res) => {
//   let fakeUser = new User({
//     email : "studentemail@gmail.com",
//     username : "Delta-Student",
//   });
//   let registeredUser = await User.register(fakeUser, "ashutosh");
//   res.send(registeredUser);
// });

// 404 handler
// app.all("*", (req, res, next) => {
//   next(new ExpressError(404, "Page not found"));
// });

// Routes


app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);


// Error handler
app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong!!!" } = err;
  res.status(statusCode).render("./listings/error.ejs", { message });
});

// Server
app.listen(8080, () => {
  console.log("Server is listening to port : 8080");
});
