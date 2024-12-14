import multer, { diskStorage } from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

// Get the directory name of the current module file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- Storage Configuration ---

const storage = diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "../uploads"); // Now uses __dirname

    fs.mkdir(uploadDir, { recursive: true }, (err) => cb(err, uploadDir));
  },

  filename: (req, file, cb) => {
    const sanitizedFilename = file.originalname.replace(
      /[^a-zA-Z0-9_.-]/g,
      "_"
    );
    cb(null, `${Date.now()}-${sanitizedFilename}`);
  },
});

// --- Multer Instance ---

const upload = multer({
  storage,
  limits: { fileSize: 1024 * 1024 * 10 }, // Optional: 10MB file size limit
  fileFilter: (req, file, cb) => {
    // Add file type filtering if needed
    const allowedMimeTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      return cb(new Error("Invalid file type"));
    }
    cb(null, true);
  },
});

export default upload;
