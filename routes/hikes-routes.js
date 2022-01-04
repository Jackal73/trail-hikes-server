import { Router } from "express";

import hikesController from "../controllers/hikes-controller.js";

const router = new Router();

router.get("/:pid", hikesController.getHikeById);

router.get("/user/:uid", hikesController.getHikeByUserId);

router.post("/", hikesController.createHike);

router.patch("/:pid", hikesController.updateHike);

router.delete("/:pid", hikesController.deleteHike);

export default router;
