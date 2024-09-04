import { User } from "../Models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import validator from "validator";
import jwt from "jsonwebtoken"

export const SignUp = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    // Validate inputs
    if (!username || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
        success: false,
      });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({
        message: "Invalid email format",
        success: false,
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters long",
        success: false,
      });
    }

    // Check if the email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "Email already in use",
        success: false,
      });
    }

    const existingUser2 = await User.findOne({ username });
    if (existingUser2) {
      return res.status(400).json({
        message: "Username already in use",
        success: false,
      });
    }

    // Hash the password
    const hashedPassword = bcryptjs.hashSync(password, 10);

    // Create and save the new user
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({
      message: "Account created successfully",
      success: true,
      newUser,
    });
  } catch (error) {
    next(error);
  }
};

export const Signin = async (req, res, next) => {

  try {

    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({
        message: "Provide both username ans Password",
        success: false
      })
    }

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({
        message: "User Does not exist Please Register",
        success: false
      })
    }

    const response = await bcryptjs.compare(password, user.password);
    if (!response) {
      return res.status(400).json({
        message: "Incorect Password or Email",
        success: false
      })
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
    const { password: pass, ...rest } = user._doc
    res.cookie('access_token', token, { httpOnly: true, maxAge: 10 * 24 * 60 * 60 * 1000 }).status(200).json({
      success: true,
      rest
    })
  } catch (error) {
    next(error);
  }
}


export const google = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      const { password:pass, ...rest } = user._doc;
      res.cookie('access_token', token, { httpOnly: true, maxAge: 10 * 24 * 60 * 60 * 1000 })
        .status(200)
        .json({
          success: true,
          rest,
        });
    } else {
      const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
      const newUser = new User({
        username: req.body.name.toLowerCase() + Math.random().toString(36).slice(-4),
        email: req.body.email,
        password: hashedPassword,
        avatar: req.body.photo,
      });
      await newUser.save();
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
      const { password, ...rest } = newUser._doc;
      res.cookie('access_token', token, { httpOnly: true, maxAge: 10 * 24 * 60 * 60 * 1000 })
        .status(200)
        .json({
          success: true,
          rest,
        });
    }
  } catch (error) {
    next(error);
  }
};


export const signOut=async(req,res,next)=>{
  try {
    res.clearCookie('access_token');
    res.status(200).json('User has been logged out!');
  } catch (error) {
    next(error)
  }
}