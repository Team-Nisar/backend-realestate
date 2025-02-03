import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// ✅ Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Save files in `/uploads`
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// ✅ File Filter for Validation
const fileFilter = (req: any, file: Express.Multer.File, cb: any) => {
  const fileSize = parseInt(req.headers["content-length"] || "0", 10);
  
  // Allowed file types
  const imageTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
  const videoTypes = ["video/mp4", "video/mov", "video/avi", "video/mkv"];

  if (imageTypes.includes(file.mimetype)) {
    if (fileSize > 1 * 1024 * 1024) { // 1MB
      return cb(new Error("Image size must be less than 1MB"), false);
    }
    return cb(null, true);
  }

  if (videoTypes.includes(file.mimetype)) {
    if (fileSize > 10 * 1024 * 1024) { // 10MB
      return cb(new Error("Video size must be less than 10MB"), false);
    }
    return cb(null, true);
  }

  cb(new Error("Invalid file type. Only images and videos are allowed"), false);
};

// ✅ Multer Upload Middleware
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});

export const imageUpload = upload.array("images", 4); // Max 6 images
export const videoUpload = upload.single("video"); // 1 Video

export default upload;
