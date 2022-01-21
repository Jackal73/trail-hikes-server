import bcrypt from "bcrypt";
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";
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

    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(password, 12);
    } catch (err) {
      const error = new HttpError(
        "Could not create user, please try again.",
        500
      );
      return next(error);
    }

    const createdUser = new User({
      name,
      email,
      image: req.file.path,
      password: hashedPassword,
      hikes: [],
    });

    try {
      await createdUser.save();
    } catch (err) {
      const error = new HttpError("Signup failed, please try again.", 500);
      return next(error);
    }

    let token;
    try {
      token = jwt.sign(
        { userId: createdUser.id, email: createdUser.email },
        "supersecret_dont_share",
        { expiresIn: "1h" }
      );
    } catch (err) {
      const error = new HttpError("Signup failed, please try again.", 500);
      return next(error);
    }

    res
      .status(201)
      .json({ userId: createdUser.id, email: createdUser.email, token });
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

    if (!existingUser) {
      const error = new HttpError(
        "Invalid credentials. . . Login failed!",
        401
      );
      return next(error);
    }

    let isValidPassword = false;
    try {
      isValidPassword = await bcrypt.compare(password, existingUser.password);
    } catch (err) {
      const error = new HttpError(
        "Could not log in, please check credentials and try again.",
        500
      );
      return next(error);
    }

    if (!isValidPassword) {
      const error = new HttpError(
        "Invalid credentials. . . Login failed!",
        401
      );
      return next(error);
    }

    let token;
    try {
      token = jwt.sign(
        { userId: existingUser.id, email: existingUser.email },
        "supersecret_dont_share",
        { expiresIn: "1h" }
      );
    } catch (err) {
      const error = new HttpError("Login failed, please try again.", 500);
      return next(error);
    }

    res.json({
      userId: existingUser.id,
      email: existingUser.email,
      token,
    });
  },
};
