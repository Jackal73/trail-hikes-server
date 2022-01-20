import { validationResult } from "express-validator";
import HttpError from "../models/http-error.js";
import User from "../models/user.js";

export default {
  async getUsers(req, res, next) {
    let users;
    try {
      users = await User.find({}, "-password");
    } catch (err) {
      const error = new HttpError(
        "Fetching Users failed, please try again later.",
        500
      );
      return next(error);
    }

    res.json({ users: users.map((user) => user.toObject({ getters: true })) });
  },

  async signup(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(
        new HttpError("Invalid inputs... please check your data.", 422)
      );
    }

    const { name, email, password } = req.body;

    let existingUser;
    try {
      existingUser = await User.findOne({ email });
    } catch (err) {
      const error = new HttpError(
        "Signup failed, please try again later.",
        500
      );
      return next(error);
    }

    if (existingUser) {
      const error = new HttpError(
        "User already exists, please try logging in",
        422
      );
      return next(error);
    }

    const createdUser = new User({
      name,
      email,
      image: req.file.path,
      password,
      hikes: [],
    });

    try {
      await createdUser.save();
    } catch (err) {
      const error = new HttpError("Signup failed, please try again.", 500);
      return next(error);
    }

    res.status(201).json({ user: createdUser.toObject({ getters: true }) });
  },

  async login(req, res, next) {
    const { email, password } = req.body;

    let existingUser;
    try {
      existingUser = await User.findOne({ email });
    } catch (err) {
      const error = new HttpError("Login failed, please try again later.", 500);
      return next(error);
    }

    if (!existingUser || existingUser.password !== password) {
      const error = new HttpError(
        "Invalid credentials. . . Login failed!",
        401
      );
      return next(error);
    }

    res.json({
      message: "Logged in!",
      user: existingUser.toObject({ getters: true }),
    });
  },
};
