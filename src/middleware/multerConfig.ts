import multer, { Multer } from "multer";
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
});
export default upload;

// import multer from "multer";
// import path from "path";

// // Define storage options for multer
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const uploadPath = path.join(__dirname, "../uploads"); // Set your desired upload path
//     cb(null, uploadPath);
//   },
//   filename: (req, file, cb) => {
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     const fileExtension = path.extname(file.originalname);
//     cb(null, `${file.fieldname}-${uniqueSuffix}${fileExtension}`);
//   },
// });

// const upload = multer({ storage });
// export default upload;
