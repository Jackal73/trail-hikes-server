import multer from "multer";
import { v4 as uuidv4 } from "uuid";

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};

const fileUpload = multer({
  limits: 500000,
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads/images");
    },
    filename: (req, file, cb) => {
      const ext = MIME_TYPE_MAP[file.mimetype];
      cb(null, uuidv4() + "." + ext);
    },
  }),
  fileFilter: (req, file, cb) => {
    // eslint-disable-next-line no-implicit-coercion
    const isValid = !!MIME_TYPE_MAP[file.mimetype];
    // eslint-disable-next-line prefer-const
    let error = isValid ? null : new Error("Invalid mime type!");
    cb(error, isValid);
  },
});

export default fileUpload;
