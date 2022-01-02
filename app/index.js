import express from "express";
import bodyParser from "body-parser";

import hikesRoutes from "../routes/hikes-routes.js";

const app = express();

app.use("/api/hikes", hikesRoutes);

app.listen(5000);
