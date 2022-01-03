import { v4 as uuidv4 } from "uuid";

import HttpError from "../models/http-error.js";

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

const getHikeById = (req, res, next) => {
  const hikeId = req.params.pid; // { pid: 'p1' }

  const hike = DUMMY_HIKES.find((p) => p.id === hikeId);

  if (!hike) {
    return next(
      new HttpError("No hike was found for the specified hike id.", 404)
    );
  }

  res.json({ hike }); // { hike } => { hike: hike }
};

const getHikeByUserId = (req, res, next) => {
  const userId = req.params.uid;

  const hike = DUMMY_HIKES.find((p) => p.creator === userId);

  if (!hike) {
    return next(
      new HttpError("No hike(s) could be found for the specified user id.", 404)
    );
  }

  res.json({ hike });
};

const createHike = (req, res, next) => {
  const { title, description, coordinates, address, creator } = req.body;
  // const title = req.body.title, ...;

  const createdHike = {
    id: uuidv4(),
    title,
    description,
    location: coordinates,
    address,
    creator,
  };

  DUMMY_HIKES.push(createdHike); // unshift (createdHike) - first element

  res.status(201).json({ place: createdHike });
};

exports.getHikeById = getHikeById;
exports.getHikeByUserId = getHikeByUserId;
exports.createHike = createHike;
