import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { performOCR } from "../controllers/ocrController.js";

const router = express.Router();

// __dirname setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const storage = multer.diskStorage({
  destination: path.join(__dirname, "..", "uploads"),
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const upload = multer({ storage });

router.post("/upload", upload.single("image"), performOCR);

export default router;
