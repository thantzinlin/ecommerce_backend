import { Request, Response, NextFunction } from "express";
import * as categoryController from "../src/controllers/categoryController";
import * as categoryService from "../src/services/categoryService";
import { sendResponse } from "../src/utils/responses";
import { StatusCodes, ResponseMessages } from "../src/utils/constants";

jest.mock("../src/services/categoryService");
jest.mock("../src/utils/responses");

(sendResponse as jest.Mock).mockImplementation(
  (res, data, statusCode, message) => {
    res.status(statusCode).json({ data, message });
  }
);

jest.mock("../src/services/categoryService");
jest.mock("../src/utils/responses");

(sendResponse as jest.Mock).mockImplementation(
  (res, data, statusCode, message) => {
    res.status(statusCode).json({ data, message });
  }
);

describe("Category Controller", () => {
  describe("getById", () => {
    it("should return category data when found", async () => {
      const mockCategory = { id: "1", name: "Electronics" };
      (categoryService.getById as jest.Mock).mockResolvedValue(mockCategory);

      const req = { params: { id: "1" } } as unknown as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;
      const next = jest.fn() as NextFunction;

      await categoryController.getById(req, res, next);

      expect(categoryService.getById).toHaveBeenCalledWith("1");
      expect(sendResponse).toHaveBeenCalledWith(res, mockCategory);
    });

    it("should return not found when category does not exist", async () => {
      (categoryService.getById as jest.Mock).mockResolvedValue(null);

      const req = { params: { id: "1" } } as unknown as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;
      const next = jest.fn() as NextFunction;

      await categoryController.getById(req, res, next);

      expect(categoryService.getById).toHaveBeenCalledWith("1");
      expect(sendResponse).toHaveBeenCalledWith(
        res,
        {},
        StatusCodes.NOT_FOUND,
        ResponseMessages.NOT_FOUND
      );
    });

    it("should call next with error on exception", async () => {
      const error = new Error("Test error");
      (categoryService.getById as jest.Mock).mockRejectedValue(error);

      const req = { params: { id: "1" } } as unknown as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;
      const next = jest.fn() as NextFunction;

      await categoryController.getById(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("getALL", () => {
    it("should return paginated category data", async () => {
      const mockData = { data: [], total: 0, pageCounts: 0 };
      (categoryService.getAll as jest.Mock).mockResolvedValue(mockData);

      const req = {
        query: { page: "1", perPage: "10", search: "", isAdmin: "false" },
      } as unknown as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;
      const next = jest.fn() as NextFunction;

      await categoryController.getALL(req, res, next);

      expect(categoryService.getAll).toHaveBeenCalledWith(0, 10, "");
      expect(sendResponse).toHaveBeenCalledWith(
        res,
        mockData.data,
        StatusCodes.OK,
        ResponseMessages.SUCCESS,
        mockData.total,
        mockData.pageCounts
      );
    });

    it("should call next with error on exception", async () => {
      const error = new Error("Test error");
      (categoryService.getAll as jest.Mock).mockRejectedValue(error);

      const req = { query: {} } as unknown as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;
      const next = jest.fn() as NextFunction;

      await categoryController.getALL(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("create", () => {
    it("should create a new category", async () => {
      const mockCategory = { id: "1", name: "Electronics" };
      (categoryService.create as jest.Mock).mockResolvedValue(mockCategory);

      const req = { body: { name: "Electronics" } } as unknown as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;
      const next = jest.fn() as NextFunction;

      await categoryController.create(req, res, next);

      expect(categoryService.create).toHaveBeenCalledWith(req.body);
      expect(sendResponse).toHaveBeenCalledWith(
        res,
        mockCategory,
        StatusCodes.CREATED
      );
    });

    it("should call next with error on exception", async () => {
      const error = new Error("Test error");
      (categoryService.create as jest.Mock).mockRejectedValue(error);

      const req = { body: { name: "Electronics" } } as unknown as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;
      const next = jest.fn() as NextFunction;

      await categoryController.create(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("findByIdAndUpdate", () => {
    it("should update category data when found", async () => {
      const mockCategory = { id: "1", name: "Electronics" };
      (categoryService.findByIdAndUpdate as jest.Mock).mockResolvedValue(
        mockCategory
      );

      const req = {
        params: { id: "1" },
        body: { name: "Updated Electronics" },
      } as unknown as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;
      const next = jest.fn() as NextFunction;

      await categoryController.findByIdAndUpdate(req, res, next);

      expect(categoryService.findByIdAndUpdate).toHaveBeenCalledWith(
        "1",
        req.body
      );
      expect(sendResponse).toHaveBeenCalledWith(res);
    });

    it("should return not found when category does not exist", async () => {
      (categoryService.findByIdAndUpdate as jest.Mock).mockResolvedValue(null);

      const req = {
        params: { id: "1" },
        body: { name: "Updated Electronics" },
      } as unknown as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;
      const next = jest.fn() as NextFunction;

      await categoryController.findByIdAndUpdate(req, res, next);

      expect(categoryService.findByIdAndUpdate).toHaveBeenCalledWith(
        "1",
        req.body
      );
      expect(sendResponse).toHaveBeenCalledWith(
        res,
        {},
        StatusCodes.NOT_FOUND,
        ResponseMessages.NOT_FOUND
      );
    });

    it("should call next with error on exception", async () => {
      const error = new Error("Test error");
      (categoryService.findByIdAndUpdate as jest.Mock).mockRejectedValue(error);

      const req = {
        params: { id: "1" },
        body: { name: "Updated Electronics" },
      } as unknown as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;
      const next = jest.fn() as NextFunction;

      await categoryController.findByIdAndUpdate(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("findByIdAndDelete", () => {
    it("should delete category data when found", async () => {
      const mockCategory = { id: "1", name: "Electronics" };
      (categoryService.findByIdAndDelete as jest.Mock).mockResolvedValue(
        mockCategory
      );

      const req = { params: { id: "1" } } as unknown as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;
      const next = jest.fn() as NextFunction;

      await categoryController.findByIdAndDelete(req, res, next);

      expect(categoryService.findByIdAndDelete).toHaveBeenCalledWith("1");
      expect(sendResponse).toHaveBeenCalledWith(res);
    });

    it("should return not found when category does not exist", async () => {
      (categoryService.findByIdAndDelete as jest.Mock).mockResolvedValue(null);

      const req = { params: { id: "1" } } as unknown as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;
      const next = jest.fn() as NextFunction;

      await categoryController.findByIdAndDelete(req, res, next);

      expect(categoryService.findByIdAndDelete).toHaveBeenCalledWith("1");
      expect(sendResponse).toHaveBeenCalledWith(
        res,
        {},
        StatusCodes.NOT_FOUND,
        ResponseMessages.NOT_FOUND
      );
    });

    it("should call next with error on exception", async () => {
      const error = new Error("Test error");
      (categoryService.findByIdAndDelete as jest.Mock).mockRejectedValue(error);

      const req = { params: { id: "1" } } as unknown as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;
      const next = jest.fn() as NextFunction;

      await categoryController.findByIdAndDelete(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
describe("Category Controller", () => {
  describe("getById", () => {
    it("should return category data when found", async () => {
      const mockCategory = { id: "1", name: "Electronics" };
      (categoryService.getById as jest.Mock).mockResolvedValue(mockCategory);

      const req = { params: { id: "1" } } as unknown as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;
      const next = jest.fn() as NextFunction;

      await categoryController.getById(req, res, next);

      expect(categoryService.getById).toHaveBeenCalledWith("1");
      expect(sendResponse).toHaveBeenCalledWith(res, mockCategory);
    });

    it("should return not found when category does not exist", async () => {
      (categoryService.getById as jest.Mock).mockResolvedValue(null);

      const req = { params: { id: "1" } } as unknown as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;
      const next = jest.fn() as NextFunction;

      await categoryController.getById(req, res, next);

      expect(categoryService.getById).toHaveBeenCalledWith("1");
      expect(sendResponse).toHaveBeenCalledWith(
        res,
        {},
        StatusCodes.NOT_FOUND,
        ResponseMessages.NOT_FOUND
      );
    });

    it("should call next with error on exception", async () => {
      const error = new Error("Test error");
      (categoryService.getById as jest.Mock).mockRejectedValue(error);

      const req = { params: { id: "1" } } as unknown as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;
      const next = jest.fn() as NextFunction;

      await categoryController.getById(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
