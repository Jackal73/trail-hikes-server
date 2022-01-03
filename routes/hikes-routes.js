import { Router } from "express";

import HttpError from "../models/http-error.js";

const router = new Router();

const DUMMY_HIKES = [
  {
    id: "p1",
    title: "Python Minion Trail",
    description: "Beautiful stone bridge halfway through hike!",
    address: "Rolla, Mo",
    location: {
      lat: 37.951424,
      lng: -91.768959,
    },
    creator: "u1",
  },
];

router.get("/:pid", (req, res, next) => {
  const hikeId = req.params.pid; // { pid: 'p1' }

  const hike = DUMMY_HIKES.find((p) => p.id === hikeId);

  if (!hike) {
    return next(
      new HttpError("No hike was found for the specified hike id.", 404)
    );
  }

  res.json({ hike }); // { hike } => { hike: hike }
});

router.get("/user/:uid", (req, res, next) => {
  const userId = req.params.uid;

  const hike = DUMMY_HIKES.find((p) => p.creator === userId);

  if (!hike) {
    return next(
      new HttpError("No hike(s) could be found for the specified user id.", 404)
    );

  res.json({ hike });
});

export default router;
