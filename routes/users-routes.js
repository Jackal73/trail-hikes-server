import { Router } from "express";

import usersController from "../controllers/users-controller.js";

const router = new Router();

router.get("/", usersController.getUsers);

router.post("/signup", usersController.signup);

router.post("/login", usersController.login);

export default router;
