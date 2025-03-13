// import { Request, Response, NextFunction } from "express";
// import * as productController from "../src/controllers/productController";
// import * as productService from "../src/services/productService";
// import { sendResponse } from "../src/utils/responses";
// import { StatusCodes, ResponseMessages } from "../src/utils/constants";
// import cloudinary from "../src/config/cloudinaryConfig";

// jest.mock("../src/services/productService");
// jest.mock("../src/utils/responses");
// jest.mock("../src/config/cloudinaryConfig");

// describe("Product Controller", () => {
//   let req: Partial<Request>;
//   let res: Partial<Response>;
//   let next: NextFunction;

//   beforeEach(() => {
//     req = {};
//     res = {
//       json: jest.fn(),
//       status: jest.fn().mockReturnThis(),
//     };
//     next = jest.fn();
//   });

//   describe("getALL", () => {
//     it("should return all products", async () => {
//       const mockData = { data: [], total: 0, pageCounts: 0 };
//       (productService.getAll as jest.Mock).mockResolvedValue(mockData);

//       req.query = { page: "1", perPage: "10", search: "" };

//       await productController.getALL(req as Request, res as Response, next);

//       expect(productService.getAll).toHaveBeenCalledWith(0, 10, "");
//       expect(sendResponse).toHaveBeenCalledWith(
//         res,
//         mockData.data,
//         StatusCodes.OK,
//         ResponseMessages.SUCCESS,
//         mockData.total,
//         mockData.pageCounts
//       );
//     });
//   });

//   describe("getById", () => {
//     it("should return product by id", async () => {
//       const mockData = { id: "1" };
//       (productService.getById as jest.Mock).mockResolvedValue(mockData);

//       req.params = { id: "1" };

//       await productController.getById(req as Request, res as Response, next);

//       expect(productService.getById).toHaveBeenCalledWith("1");
//       expect(sendResponse).toHaveBeenCalledWith(res, mockData);
//     });

//     it("should return 404 if product not found", async () => {
//       (productService.getById as jest.Mock).mockResolvedValue(null);

//       req.params = { id: "1" };

//       await productController.getById(req as Request, res as Response, next);

//       expect(productService.getById).toHaveBeenCalledWith("1");
//       expect(sendResponse).toHaveBeenCalledWith(
//         res,
//         {},
//         StatusCodes.NOT_FOUND,
//         ResponseMessages.NOT_FOUND
//       );
//     });
//   });

//   describe("getByIdWithReview", () => {
//     it("should return product with reviews by id", async () => {
//       const mockData = { id: "1", reviews: [] };
//       (productService.getByIdWithReview as jest.Mock).mockResolvedValue(
//         mockData
//       );

//       req.params = { id: "1" };

//       await productController.getByIdWithReview(
//         req as Request,
//         res as Response,
//         next
//       );

//       expect(productService.getByIdWithReview).toHaveBeenCalledWith("1");
//       expect(sendResponse).toHaveBeenCalledWith(res, mockData);
//     });

//     it("should return 404 if product with reviews not found", async () => {
//       (productService.getByIdWithReview as jest.Mock).mockResolvedValue(null);

//       req.params = { id: "1" };

//       await productController.getByIdWithReview(
//         req as Request,
//         res as Response,
//         next
//       );

//       expect(productService.getByIdWithReview).toHaveBeenCalledWith("1");
//       expect(sendResponse).toHaveBeenCalledWith(
//         res,
//         {},
//         StatusCodes.NOT_FOUND,
//         ResponseMessages.NOT_FOUND
//       );
//     });
//   });

//   describe("findByIdAndUpdate", () => {
//     it("should update product by id", async () => {
//       const mockData = { id: "1" };
//       (productService.findByIdAndUpdate as jest.Mock).mockResolvedValue(
//         mockData
//       );

//       req.params = { id: "1" };
//       req.body = { name: "Updated Product" };

//       await productController.findByIdAndUpdate(
//         req as Request,
//         res as Response,
//         next
//       );

//       expect(productService.findByIdAndUpdate).toHaveBeenCalledWith(
//         "1",
//         req.body
//       );
//       expect(sendResponse).toHaveBeenCalledWith(res);
//     });

//     it("should return 404 if product not found", async () => {
//       (productService.findByIdAndUpdate as jest.Mock).mockResolvedValue(null);

//       req.params = { id: "1" };
//       req.body = { name: "Updated Product" };

//       await productController.findByIdAndUpdate(
//         req as Request,
//         res as Response,
//         next
//       );

//       expect(productService.findByIdAndUpdate).toHaveBeenCalledWith(
//         "1",
//         req.body
//       );
//       expect(sendResponse).toHaveBeenCalledWith(
//         res,
//         {},
//         StatusCodes.NOT_FOUND,
//         ResponseMessages.NOT_FOUND
//       );
//     });
//   });

//   describe("findByIdAndDelete", () => {
//     it("should delete product by id", async () => {
//       const mockData = { id: "1" };
//       (productService.findByIdAndDelete as jest.Mock).mockResolvedValue(
//         mockData
//       );

//       req.params = { id: "1" };

//       await productController.findByIdAndDelete(
//         req as Request,
//         res as Response,
//         next
//       );

//       expect(productService.findByIdAndDelete).toHaveBeenCalledWith("1");
//       expect(sendResponse).toHaveBeenCalledWith(res);
//     });

//     it("should return 404 if product not found", async () => {
//       (productService.findByIdAndDelete as jest.Mock).mockResolvedValue(null);

//       req.params = { id: "1" };

//       await productController.findByIdAndDelete(
//         req as Request,
//         res as Response,
//         next
//       );

//       expect(productService.findByIdAndDelete).toHaveBeenCalledWith("1");
//       expect(sendResponse).toHaveBeenCalledWith(
//         res,
//         {},
//         StatusCodes.NOT_FOUND,
//         ResponseMessages.NOT_FOUND
//       );
//     });
//   });

//   describe("create", () => {
//     it("should create a new product", async () => {
//       const mockProduct = { id: "1", name: "New Product" };
//       const mockImageUpload = { secure_url: "http://image.url" };

//       (cloudinary.uploader.upload as jest.Mock).mockResolvedValue(
//         mockImageUpload
//       );
//       (productService.create as jest.Mock).mockResolvedValue(mockProduct);

//       req.body = { name: "New Product", images: ["base64Image"] };

//       await productController.create(req as Request, res as Response, next);

//       expect(cloudinary.uploader.upload).toHaveBeenCalledWith("base64Image");
//       expect(productService.create).toHaveBeenCalledWith({
//         ...req.body,
//         images: [mockImageUpload.secure_url],
//       });
//       expect(sendResponse).toHaveBeenCalledWith(
//         res,
//         mockProduct,
//         StatusCodes.CREATED
//       );
//     });
//   });

//   describe("getByCategoryId", () => {
//     it("should return products by category id", async () => {
//       const mockData = [{ id: "1" }];
//       (productService.getByCategoryId as jest.Mock).mockResolvedValue(mockData);

//       req.params = { id: "1" };

//       await productController.getByCategoryId(
//         req as Request,
//         res as Response,
//         next
//       );

//       expect(productService.getByCategoryId).toHaveBeenCalledWith("1");
//       expect(sendResponse).toHaveBeenCalledWith(res, mockData);
//     });

//     it("should return 404 if no products found", async () => {
//       (productService.getByCategoryId as jest.Mock).mockResolvedValue(null);

//       req.params = { id: "1" };

//       await productController.getByCategoryId(
//         req as Request,
//         res as Response,
//         next
//       );

//       expect(productService.getByCategoryId).toHaveBeenCalledWith("1");
//       expect(sendResponse).toHaveBeenCalledWith(
//         res,
//         {},
//         StatusCodes.NOT_FOUND,
//         ResponseMessages.NOT_FOUND
//       );
//     });
//   });
// });
