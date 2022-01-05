import { v4 as uuidv4 } from "uuid";
import { validationResult } from "express-validator";

import HttpError from "../models/http-error.js";

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

  signup(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new HttpError("Invalid inputs... please check your data.", 422);
    }
    const { name, email, password } = req.body;

    const hasUser = DUMMY_USERS.find((u) => u.email === email);
    if (hasUser) {
      throw new HttpError(
        "Could not create user... email already exists.",
        422
      );
    }

    const createdUser = {
      id: uuidv4(),
      name, // name: name
      email,
      password,
    };

    DUMMY_USERS.push(createdUser);

    res.status(201).json({ user: createdUser });
  },

  login(req, res, next) {
    const { email, password } = req.body;

    const identifiedUser = DUMMY_USERS.find((u) => u.email === email);
    if (!identifiedUser || identifiedUser.password !== password) {
      throw new HttpError(
        "User is not recognized... invalid credentials.",
        401
      );
    }

    res.json({ message: "Logged in!" });
  },
};
