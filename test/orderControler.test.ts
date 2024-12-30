import { Request, Response, NextFunction } from "express";
import * as orderController from "../src/controllers/orderController";
import * as orderService from "../src/services/orderService";
import * as notiService from "../src/services/notiService";
import { sendResponse } from "../src/utils/responses";
import { StatusCodes, ResponseMessages } from "../src/utils/constants";
import { io } from "../src/server";

jest.mock("../src/services/orderService");
jest.mock("../src/services/notiService");
jest.mock("../src/utils/responses");
jest.mock("../src/server");

describe("Order Controller", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {};
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
    next = jest.fn();
  });

  describe("getALL", () => {
    it("should return all orders", async () => {
      const mockData = { data: [], total: 0, pageCounts: 0 };
      (orderService.getAll as jest.Mock).mockResolvedValue(mockData);

      req.query = { page: "1", perPage: "10", search: "" };

      await orderController.getALL(req as Request, res as Response, next);

      expect(orderService.getAll).toHaveBeenCalledWith(0, 10, "");
      expect(sendResponse).toHaveBeenCalledWith(
        res,
        mockData.data,
        StatusCodes.OK,
        ResponseMessages.SUCCESS,
        mockData.total,
        mockData.pageCounts
      );
    });
  });

  describe("getById", () => {
    it("should return order by id", async () => {
      const mockData = { id: "1" };
      (orderService.getById as jest.Mock).mockResolvedValue(mockData);

      req.params = { id: "1" };

      await orderController.getById(req as Request, res as Response, next);

      expect(orderService.getById).toHaveBeenCalledWith("1");
      expect(sendResponse).toHaveBeenCalledWith(res, mockData);
    });

    it("should return 404 if order not found", async () => {
      (orderService.getById as jest.Mock).mockResolvedValue(null);

      req.params = { id: "1" };

      await orderController.getById(req as Request, res as Response, next);

      expect(orderService.getById).toHaveBeenCalledWith("1");
      expect(sendResponse).toHaveBeenCalledWith(
        res,
        {},
        StatusCodes.NOT_FOUND,
        ResponseMessages.NOT_FOUND
      );
    });
  });

  describe("findByIdAndUpdate", () => {
    it("should update order by id", async () => {
      const mockData = { id: "1" };
      (orderService.findByIdAndUpdate as jest.Mock).mockResolvedValue(mockData);

      req.params = { id: "1" };
      req.body = { status: "Updated" };

      await orderController.findByIdAndUpdate(
        req as Request,
        res as Response,
        next
      );

      expect(orderService.findByIdAndUpdate).toHaveBeenCalledWith(
        "1",
        req.body
      );
      expect(sendResponse).toHaveBeenCalledWith(res);
    });

    it("should return 404 if order not found", async () => {
      (orderService.findByIdAndUpdate as jest.Mock).mockResolvedValue(null);

      req.params = { id: "1" };
      req.body = { status: "Updated" };

      await orderController.findByIdAndUpdate(
        req as Request,
        res as Response,
        next
      );

      expect(orderService.findByIdAndUpdate).toHaveBeenCalledWith(
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
  });

  describe("findByIdAndDelete", () => {
    it("should delete order by id", async () => {
      const mockData = { id: "1" };
      (orderService.findByIdAndDelete as jest.Mock).mockResolvedValue(mockData);

      req.params = { id: "1" };

      await orderController.findByIdAndDelete(
        req as Request,
        res as Response,
        next
      );

      expect(orderService.findByIdAndDelete).toHaveBeenCalledWith("1");
      expect(sendResponse).toHaveBeenCalledWith(res);
    });

    it("should return 404 if order not found", async () => {
      (orderService.findByIdAndDelete as jest.Mock).mockResolvedValue(null);

      req.params = { id: "1" };

      await orderController.findByIdAndDelete(
        req as Request,
        res as Response,
        next
      );

      expect(orderService.findByIdAndDelete).toHaveBeenCalledWith("1");
      expect(sendResponse).toHaveBeenCalledWith(
        res,
        {},
        StatusCodes.NOT_FOUND,
        ResponseMessages.NOT_FOUND
      );
    });
  });

  describe("create", () => {
    it("should create a new order", async () => {
      const mockOrder = { id: "1", orderNumber: "12345" };
      const mockNotiData = {
        userId: "1",
        type: "order",
        message: `New order received: 12345`,
      };

      (orderService.generateOrderNumber as jest.Mock).mockResolvedValue(
        "12345"
      );
      (orderService.create as jest.Mock).mockResolvedValue(mockOrder);
      (notiService.create as jest.Mock).mockResolvedValue({});
      (io.to as jest.Mock).mockReturnValue({ emit: jest.fn() });

      req.body = { userId: "1" };

      await orderController.create(req as Request, res as Response, next);

      expect(orderService.generateOrderNumber).toHaveBeenCalled();
      expect(orderService.create).toHaveBeenCalledWith({
        ...req.body,
        orderNumber: "12345",
      });
      expect(notiService.create).toHaveBeenCalledWith(mockNotiData);
      expect(io.to).toHaveBeenCalledWith("adminRoom");
      expect(sendResponse).toHaveBeenCalledWith(
        res,
        mockOrder,
        StatusCodes.CREATED
      );
    });
  });

  describe("getOrdersByUserId", () => {
    it("should return orders by user id", async () => {
      const mockData = [{ id: "1" }];
      (orderService.getOrdersByUserId as jest.Mock).mockResolvedValue(mockData);

      req.body = { userId: "1" };

      await orderController.getOrdersByUserId(
        req as Request,
        res as Response,
        next
      );

      expect(orderService.getOrdersByUserId).toHaveBeenCalledWith("1");
      expect(sendResponse).toHaveBeenCalledWith(res, mockData);
    });

    it("should return 404 if no orders found", async () => {
      (orderService.getOrdersByUserId as jest.Mock).mockResolvedValue(null);

      req.body = { userId: "1" };

      await orderController.getOrdersByUserId(
        req as Request,
        res as Response,
        next
      );

      expect(orderService.getOrdersByUserId).toHaveBeenCalledWith("1");
      expect(sendResponse).toHaveBeenCalledWith(
        res,
        {},
        StatusCodes.NOT_FOUND,
        ResponseMessages.NOT_FOUND
      );
    });
  });

  describe("getOrdersByStatus", () => {
    it("should return orders by status", async () => {
      const mockData = [{ id: "1" }];
      (orderService.getOrdersByStatus as jest.Mock).mockResolvedValue(mockData);

      req.body = { userId: "1" };

      await orderController.getOrdersByStatus(
        req as Request,
        res as Response,
        next
      );

      expect(orderService.getOrdersByStatus).toHaveBeenCalledWith(
        "1",
        "Cancelled"
      );
      expect(sendResponse).toHaveBeenCalledWith(res, mockData);
    });

    it("should return 404 if no orders found", async () => {
      (orderService.getOrdersByStatus as jest.Mock).mockResolvedValue(null);

      req.body = { userId: "1" };

      await orderController.getOrdersByStatus(
        req as Request,
        res as Response,
        next
      );

      expect(orderService.getOrdersByStatus).toHaveBeenCalledWith(
        "1",
        "Cancelled"
      );
      expect(sendResponse).toHaveBeenCalledWith(
        res,
        {},
        StatusCodes.NOT_FOUND,
        ResponseMessages.NOT_FOUND
      );
    });
  });
});
