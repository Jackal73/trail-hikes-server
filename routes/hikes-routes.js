import { Router } from "express";

import hikesController from "../controllers/hikes-controller.js";

const router = new Router();

router.get("/:pid", hikesController.getHikeById);

router.get("/user/:uid", hikesController.getHikeByUserId);

router.post("/", hikesController.createHike);

export default router;
