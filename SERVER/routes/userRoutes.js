const express = require("express");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

const router = express.Router();

const {protect} = require("../middleware/authMiddleware");

//@route POST /api/users/register
//@desc Register a new user
//@access Public
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    //REGISTRATION LOGIC
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User Already Exist." });

    user = new User({ name, email, password });
    await user.save();

    //Create JWT Payload
    const payload = { user: { id: user._id, role: user.role } };
    //Sign and return the token along with user data
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
      (err, token) => {
        if (err) throw err; //throw means if error is there it would stop the further exexution and throws the error

        //Send the user and token in response.
        res.status(201).json({
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
          token,
        });
      }
    );
  } catch (error) {
    console.log(error);
    res.status(500);
  }
});

//@route POST /api/users/login
//@desc Authenticate User
//@access Public
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid Credentials." });
    const isMatch = await user.matchPassword(password);

    if (!isMatch)
      return res.status(400).json({
        message: "Invalid Credentials.",
      });

    const payload = { user: { id: user._id, role: user.role } };
    //Sign and return the token along with user data
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
      (err, token) => {
        if (err)
          return res.status(500).json({ message: "Token generation failed" });

        //Send the user and token in response.
        res.json({
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
          token,
        });
      }
    );
  } catch (error) {
    console.log("Error in Login Route", error);
    res.status(500).send("Server ERROR");
  }
});

//@route GET /api/users/profile
//@desc Get logged-in user's Profile
//@Access Private
router.get("/profile", protect, async (req, res) => {
  res.json(req.user);
});

module.exports = router;
