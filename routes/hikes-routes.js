import { Router } from "express";

const router = new Router();

router.get("/", (req, res) => {
  console.log("GET Request in Hikes");
  res.json({ message: "It works!" });
});

export default router;
