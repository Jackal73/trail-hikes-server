import { v4 as uuidv4 } from "uuid";
import HttpError from "../models/http-error.js";

let DUMMY_HIKES = [
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

export default {
  getHikeById(req, res, next) {
    const hikeId = req.params.pid; // { pid: 'p1' }

    const hike = DUMMY_HIKES.find((p) => p.id === hikeId);

    if (!hike) {
      return next(
        new HttpError("No hike was found for the specified hike id.", 404)
      );
    }

    res.json({ hike }); // { hike } => { hike: hike }
  },

  getHikesByUserId(req, res, next) {
    const userId = req.params.uid;

    const hikes = DUMMY_HIKES.filter((p) => p.creator === userId);

    if (!hikes || hikes.length === 0) {
      return next(
        new HttpError(
          "There were no hikes found for the specified user id.",
          404
        )
      );
    }

    res.json({ hikes });
  },

  createHike(req, res, next) {
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

    res.status(201).json({ hike: createdHike });
  },

  updateHike(req, res, next) {
    const { title, description } = req.body;
    const hikeId = req.params.pid;

    const updatedHike = { ...DUMMY_HIKES.find((p) => p.id === hikeId) };
    const hikeIndex = DUMMY_HIKES.findIndex((p) => p.id === hikeId);

    updatedHike.title = title;
    updatedHike.description = description;

    DUMMY_HIKES[hikeIndex] = updatedHike;

    res.status(200).json({ hike: updatedHike });
  },

  deleteHike(req, res, next) {
    const hikeId = req.params.pid;

    DUMMY_HIKES = DUMMY_HIKES.filter((p) => p.id !== hikeId);

    res.status(200).json({ message: "Hike Deleted..." });
  },
};
