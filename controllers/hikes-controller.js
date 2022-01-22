import { validationResult } from "express-validator";
import fs from "fs";
import mongoose from "mongoose";
import Hike from "../models/hike.js";
import HttpError from "../models/http-error.js";
import User from "../models/user.js";
import getCoordsForAddress from "../util/location.js";

export default {
  async getHikeById(req, res, next) {
    const hikeId = req.params.pid;

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

    res.json({ hike: hike.toObject({ getters: true }) });
  },

  async getHikesByUserId(req, res, next) {
    const userId = req.params.uid;

    // let hikes;
    let userWithHikes;
    try {
      userWithHikes = await User.findById(userId).populate("hikes");
    } catch (err) {
      const error = new HttpError(
        "Fetching hikes failed, please try again later.",
        500
      );
      return next(error);
    }

    // if (!hikes || hikes.length === 0) {
    if (!userWithHikes || userWithHikes.hikes.length === 0) {
      return next(
        new HttpError(
          "There were no hikes found for the specified user id.",
          404
        )
      );
    }

    res.json({
      hikes: userWithHikes.hikes.map((hike) =>
        hike.toObject({ getters: true })
      ),
    });
  },

  async createHike(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(
        new HttpError("Invalid inputs... please check your data.", 422)
      );
    }

    const { title, description, address } = req.body;

    let coordinates;
    try {
      coordinates = await getCoordsForAddress(address);
    } catch (error) {
      return next(error);
    }

    const createdHike = new Hike({
      title,
      description,
      address,
      location: coordinates,
      image: req.file.path,
      creator: req.userData.userId,
    });

    let user;

    try {
      user = await User.findById(req.userData.userId);
    } catch (err) {
      const error = new HttpError(
        "Creating a hike failed, please try again.",
        500
      );
      return next(error);
    }

    if (!user) {
      const error = new HttpError("User not found with that id", 404);
      return next(error);
    }

    console.log(user);

    try {
      const sesion = await mongoose.startSession();
      sesion.startTransaction();
      await createdHike.save({ session: sesion });
      user.hikes.push(createdHike);
      await user.save({ session: sesion });
      await sesion.commitTransaction();
    } catch (err) {
      const error = new HttpError(
        "Creating hike failed, please try again.",
        500
      );
      return next(error);
    }

    res.status(201).json({ hike: createdHike });
  },

  async updateHike(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(
        new HttpError("Invalid inputs... please check your data.", 422)
      );
    }

    const { title, description } = req.body;
    const hikeId = req.params.pid;

    let hike;
    try {
      hike = await Hike.findById(hikeId);
    } catch (err) {
      const error = new HttpError(
        "Something went wrong, could not update hike.",
        500
      );
      return next(error);
    }

    if (hike.creator.toString() !== req.userData.userId) {
      const error = new HttpError(
        "You are not authorized to EDIT this hike.",
        401
      );
      return next(error);
    }

    hike.title = title;
    hike.description = description;

    try {
      await hike.save();
    } catch (err) {
      const error = new HttpError(
        "Something went wrong, could not update hike.",
        500
      );
      return next(error);
    }

    res.status(200).json({ hike: hike.toObject({ getters: true }) });
  },

  async deleteHike(req, res, next) {
    const hikeId = req.params.pid;

    let hike;
    try {
      hike = await Hike.findById(hikeId).populate("creator");
    } catch (err) {
      const error = new HttpError(
        "Something went wrong, could not delete hike.",
        500
      );
      return next(error);
    }

    if (!hike) {
      const error = new HttpError("Could not find a hike for this id.", 404);
      return next(error);
    }

    if (hike.creator.id !== req.userData.userId) {
      const error = new HttpError(
        "You are not authorized to DELETE this hike.",
        401
      );
      return next(error);
    }

    const imagePath = hike.image;

    try {
      const sesion = await mongoose.startSession();
      sesion.startTransaction();
      await hike.remove({ session: sesion });
      hike.creator.hikes.pull(hike);
      await hike.creator.save({ session: sesion });
      await sesion.commitTransaction();
    } catch (err) {
      const error = new HttpError(
        "Something went wrong, could not delete hike.",
        500
      );
      return next(error);
    }

    fs.unlink(imagePath, (err) => {
      console.log(err);
    });

    res.status(200).json({ message: "Hike Deleted..." });
  },
};
