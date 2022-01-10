import { validationResult } from "express-validator";
import Hike from "../models/hike.js";
import HttpError from "../models/http-error.js";
import getCoordsForAddress from "../util/location.js";

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
  async getHikeById(req, res, next) {
    const hikeId = req.params.pid; // { pid: 'p1' }

    let hike;
    try {
      hike = await Hike.findById(hikeId);
    } catch (err) {
      const error = new HttpError(
        "Something went wrong, could not find a hike.",
        500
      );
      return next(error);
    }

    if (!hike) {
      const error = new HttpError(
        "Could not find a hike for the provided Id.",
        404
      );
      return next(error);
    }

    res.json({ hike: hike.toObject({ getters: true }) }); // => { hike } => { hike: hike }
  },

  async getHikesByUserId(req, res, next) {
    const userId = req.params.uid;

    let hikes;
    try {
      hikes = await Hike.find({ creator: userId });
    } catch (err) {
      const error = new HttpError(
        "Fetching hikes failed, please try again later.",
        500
      );
      return next(error);
    }

    if (!hikes || hikes.length === 0) {
      return next(
        new HttpError(
          "There were no hikes found for the specified user id.",
          404
        )
      );
    }

    res.json({
      hikes: hikes.map((hike) => hike.toObject({ getters: true })),
    });
  },

  async createHike(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(
        new HttpError("Invalid inputs... please check your data.", 422)
      );
    }

    const { title, description, address, creator } = req.body;

    let coordinates;
    try {
      coordinates = await getCoordsForAddress(address);
    } catch (error) {
      return next(error);
    }

    // const title = req.body.title, ...;
    const createdHike = new Hike({
      title,
      description,
      address,
      location: coordinates,
      image:
        "https://image.shutterstock.com/image-photo/two-friends-travel-mountains-backpacks-600w-1434031928.jpg",
      creator,
    });

    try {
      await createdHike.save();
    } catch (err) {
      const error = new HttpError(
        "Creating hike failed, please try again.",
        500
      );
      return next(error);
    }

    res.status(201).json({ hike: createdHike });
  },

  updateHike(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new HttpError("Invalid inputs... please check your data.", 422);
    }

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
    if (!DUMMY_HIKES.find((p) => p.id === hikeId)) {
      throw new HttpError("Could not find a place for that id.", 404);
    }

    DUMMY_HIKES = DUMMY_HIKES.filter((p) => p.id !== hikeId);

    res.status(200).json({ message: "Hike Deleted..." });
  },
};
