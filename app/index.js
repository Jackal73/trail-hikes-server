import express from "express";
import bodyParser from "body-parser";

import hikesRoutes from "../routes/hikes-routes.js";

const app = express();

app.use("/api/hikes", hikesRoutes);

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }

  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occurred!" });
});

app.listen(5000);
