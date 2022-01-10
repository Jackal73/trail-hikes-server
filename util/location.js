import axios from "axios";

import HttpError from "../models/http-error.js";

const API_KEY = "AIzaSyBOekmDaVHxWmBzd5VtoisNSTyx0cq6vbg";

async function getCoordsForAddress(address) {
  const response = await axios.get(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${API_KEY}`
  );

  const { data } = response;

  if (!data || data.status === "ZERO_RESULTS") {
    const error = new HttpError(
      "Could not find location for the specified address.",
      422
    );
    throw error;
  }

  const coordinates = data.results[0].geometry.location;

  return coordinates;
}

export default getCoordsForAddress;
