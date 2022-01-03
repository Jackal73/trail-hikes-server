import express from "express";

import hikesRoutes from "../routes/hikes-routes.js";

const app = express();

// Middleware that allows express to read incoming json requests
app.use(express.json());

app.use("/api/hikes", hikesRoutes);

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }

  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occurred!" });
});

app.listen(5000);
