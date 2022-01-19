import { Router } from "express";
import { check } from "express-validator";

import usersController from "../controllers/users-controller.js";
import fileUpload from "../middleware/file-upload.js";

const router = new Router();

router.get("/", usersController.getUsers);

router.post(
  "/signup",
  fileUpload.single("image"),
  [
    check("name").not().isEmpty(),
    check("email").normalizeEmail().isEmail(), // test@test.com => test@test.com
    check("password").isLength({ min: 6 }),
  ],
  usersController.signup
);

router.post("/login", usersController.login);

export default router;
