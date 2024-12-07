import { Request, Response, NextFunction } from "express";
import * as userController from "../src/controllers/userController";
import * as userService from "../src/services/userService";
import { sendResponse } from "../src/utils/responses";
import bcrypt from "bcrypt";

jest.mock("../src/services/userService");
jest.mock("../src/utils/responses");

describe("User Controller", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });
  // it("should create a user", async () => {
  //   const mockHashedPassword = "hashedPassword";
  //   (bcrypt.hash as jest.Mock).mockResolvedValue(mockHashedPassword);

  //   const mockUser = {
  //     id: "1",
  //     name: "John Doe",
  //     password: mockHashedPassword,
  //   };
  //   (userService.createUser as jest.Mock).mockResolvedValue(mockUser);

  //   const req = {
  //     body: { name: "John Doe", password: "password123" },
  //   } as unknown as Request;

  //   const res = {
  //     status: jest.fn().mockReturnThis(),
  //     json: jest.fn(),
  //   } as unknown as Response;

  //   const next = jest.fn() as NextFunction;

  //   await userController.createUser(req, res, next);

  //   expect(bcrypt.hash).toHaveBeenCalledWith("password123", 10);
  //   expect(userService.createUser).toHaveBeenCalledWith({
  //     name: "John Doe",
  //     password: mockHashedPassword,
  //   });
  //   expect(sendResponse).toHaveBeenCalledWith(
  //     res,
  //     mockUser,
  //     201,
  //     "User created successfully"
  //   );
  // });

  it("should fetch all users", async () => {
    const mockUsers = [{ id: "1", username: "John Doe" }];
    (userService.getAllUsers as jest.Mock).mockResolvedValue(mockUsers);

    const req = { query: { page: "1", limit: "10" } } as unknown as Request;
    const res = { status: jest.fn(), json: jest.fn() } as unknown as Response;
    const next = jest.fn() as NextFunction;

    await userController.getUsers(req, res, next);

    expect(userService.getAllUsers).toHaveBeenCalled();
    expect(sendResponse).toHaveBeenCalledWith(res, mockUsers);
  });

  it("should fetch a user by ID", async () => {
    const mockUser = { id: "1", username: "John Doe" };
    (userService.getUserById as jest.Mock).mockResolvedValue(mockUser);

    const req = { params: { id: "1" } } as unknown as Request;
    const res = { status: jest.fn(), json: jest.fn() } as unknown as Response;
    const next = jest.fn() as NextFunction;

    await userController.getUser(req, res, next);

    expect(userService.getUserById).toHaveBeenCalledWith("1");
    expect(sendResponse).toHaveBeenCalledWith(res, mockUser);
  });

  it("should handle user not found in getUser", async () => {
    (userService.getUserById as jest.Mock).mockResolvedValue(null);

    const req = { params: { id: "1" } } as unknown as Request;
    const res = { status: jest.fn(), json: jest.fn() } as unknown as Response;
    const next = jest.fn() as NextFunction;

    await userController.getUser(req, res, next);

    expect(userService.getUserById).toHaveBeenCalledWith("1");
    expect(sendResponse).toHaveBeenCalledWith(res, {}, 404, "Data Not Found");
  });

  it("should update a user", async () => {
    const mockUser = { id: "1", username: "Jane Doe" };
    (userService.updateUser as jest.Mock).mockResolvedValue(mockUser);

    const req = {
      params: { id: "1" },
      body: { username: "Jane Doe" },
    } as unknown as Request;

    const res = { status: jest.fn(), json: jest.fn() } as unknown as Response;
    const next = jest.fn() as NextFunction;

    await userController.updateUser(req, res, next);

    expect(userService.updateUser).toHaveBeenCalledWith("1", {
      username: "Jane Doe",
    });
    expect(sendResponse).toHaveBeenCalledWith(
      res,
      mockUser,
      200,
      "User updated successfully"
    );
  });

  it("should delete a user", async () => {
    (userService.deleteUser as jest.Mock).mockResolvedValue(true);

    const req = { params: { id: "1" } } as unknown as Request;
    const res = { status: jest.fn(), json: jest.fn() } as unknown as Response;
    const next = jest.fn() as NextFunction;

    await userController.deleteUser(req, res, next);

    expect(userService.deleteUser).toHaveBeenCalledWith("1");
    expect(sendResponse).toHaveBeenCalledWith(
      res,
      {},
      200,
      "User deleted successfully"
    );
  });
});
