import express from "express";
import mongoose from "mongoose";
import HttpError from "../models/http-error.js";
import hikesRoutes from "../routes/hikes-routes.js";
import usersRoutes from "../routes/users-routes.js";

const app = express();

// Middleware that allows express to read incoming json requests
app.use(express.json());

app.use("/api/hikes", hikesRoutes);
app.use("/api/users", usersRoutes);

app.use((req, res, next) => {
  const error = new HttpError("Could not find this route", 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }

  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occurred!" });
});

mongoose
  .connect(
    "mongodb+srv://Shawn:Yoshi1988@cluster0.kaflr.mongodb.net/TrailHikesApp?retryWrites=true&w=majority"
  )
  .then(() => {
    app.listen(5000);
  })
  .catch((err) => {
    console.log(err);
  });
