import { Router } from "express";

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

router.get("/:pid", (req, res) => {
  const hikeId = req.params.pid; // { pid: 'p1' }
  const hike = DUMMY_HIKES.find((p) => p.id === hikeId);
  res.json({ hike }); // { hike } => { hike: hike }
});

router.get("/user/:uid", (req, res) => {
  const userId = req.params.uid;
  const hike = DUMMY_HIKES.find((p) => p.creator === userId);
  res.json({ hike });
});
export default router;
