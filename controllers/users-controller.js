import { v4 as uuidv4 } from "uuid";
import { validationResult } from "express-validator";

import HttpError from "../models/http-error.js";
import User from "../models/user.js";

const DUMMY_USERS = [
  {
    id: "u1",
    name: "Shawn Kebel",
    email: "test@test.com",
    password: "tester",
  },
];

export default {
  getUsers(req, res, next) {
    res.json({ users: DUMMY_USERS });
  },

  async signup(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(
        new HttpError("Invalid inputs... please check your data.", 422)
      );
    }

    const { name, email, password, hikes } = req.body;

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
      image:
        "https://image.shutterstock.com/z/stock-photo-businessman-multitasking-510805411.jpg",
      password,
      hikes,
    });

    try {
      await createdUser.save();
    } catch (err) {
      const error = new HttpError("Signup failed, please try again.", 500);
      return next(error);
    }

    res.status(201).json({ user: createdUser.toObject({ getters: true }) });
  },

  login(req, res, next) {
    const { email, password } = req.body;

    const identifiedUser = DUMMY_USERS.find((u) => u.email === email);
    if (!identifiedUser || identifiedUser.password !== password) {
      return next(
        new HttpError("User is not recognized... invalid credentials.", 401)
      );
    }

    res.json({ message: "Logged in!" });
  },
};
