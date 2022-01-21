import { Router } from "express";
import { check } from "express-validator";

import hikesController from "../controllers/hikes-controller.js";
import checkAuth from "../middleware/check-auth.js";
import fileUpload from "../middleware/file-upload.js";

const router = new Router();

router.get("/:pid", hikesController.getHikeById);

router.get("/user/:uid", hikesController.getHikesByUserId);

router.use(checkAuth);

router.post(
  "/",
  fileUpload.single("image"),
  [
    check("title").not().isEmpty(),
    check("description").isLength({ min: 7 }),
    check("address").not().isEmpty(),
  ],
  hikesController.createHike
);

router.patch(
  "/:pid",
  [check("title").not().isEmpty(), check("description").isLength({ min: 7 })],
  hikesController.updateHike
);

router.delete("/:pid", hikesController.deleteHike);

export default router;
