import { Request } from "express";

declare global {
  namespace Express {
    interface Request {
      file?: Multer.File; // Add the file property for multer
    }
  }
}
