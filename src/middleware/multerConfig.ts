import multer from "multer";
import path from "path";

// Define storage options for multer
const storage = multer.diskStorage({
  // Specify the destination for uploaded files
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../uploads"); // Change '../uploads' to your desired path
    cb(null, uploadPath); // Set the destination directory
  },
  // Specify the filename for uploaded files
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const fileExtension = path.extname(file.originalname); // Get the file extension
    cb(null, `${file.fieldname}-${uniqueSuffix}${fileExtension}`); // Use fieldname and unique timestamp for filename
  },
});

// Define file filter to validate file types
const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedTypes = ["image/jpg", "image/png", "image/gif"]; // Allowed MIME types
  if (!allowedTypes.includes(file.mimetype)) {
    //  return cb(new Error('Invalid file type. Only JPEG, PNG, and GIF are allowed.'), false);
  }
  cb(null, true);
};

// Create the multer instance with the storage and file filter
const multerConfig = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
  fileFilter,
}).single("image");
export default multerConfig;
