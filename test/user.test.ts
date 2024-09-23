import { Request, Response, NextFunction } from "express";
import * as userController from "../src/controllers/userController";
import * as userService from "../src/services/userService";
import bcrypt from "bcrypt";

jest.mock("../src/services/userService");
jest.mock("bcrypt");

describe("User Controller", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should fetch all users", async () => {
    const mockUsers = [{ id: "1", username: "John Doe" }];
    (userService.getAllUsers as jest.Mock).mockResolvedValue(mockUsers);

    const req = {} as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;
    const next = jest.fn() as NextFunction;

    await userController.getUsers(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockUsers);
  });

  it("should fetch a user by ID", async () => {
    const mockUser = { id: "1", username: "John Doe" };
    (userService.getUserById as jest.Mock).mockResolvedValue(mockUser);

    const req = { params: { id: "1" } } as unknown as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;
    const next = jest.fn() as NextFunction;

    await userController.getUser(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockUser);
  });

  it("should handle user not found in getUser", async () => {
    (userService.getUserById as jest.Mock).mockResolvedValue(null);

    const req = { params: { id: "1" } } as unknown as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;
    const next = jest.fn() as NextFunction;

    await userController.getUser(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "User not found" });
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

  //   await userController.createUser(req, res);

  //   expect(res.status).toHaveBeenCalledWith(201);
  //   expect(res.json).toHaveBeenCalledWith(mockUser);
  // });

  it("should update a user", async () => {
    const mockUser = { id: "1", name: "John Doe" };
    (userService.updateUser as jest.Mock).mockResolvedValue(mockUser);

    const req = {
      params: { id: "1" },
      body: { name: "Jane Doe" },
    } as unknown as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;
    const next = jest.fn() as NextFunction;

    await userController.updateUser(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockUser);
  });

  // Uncomment and write the delete user test when the delete controller function is implemented
  it("should delete a user", async () => {
    (userService.deleteUser as jest.Mock).mockResolvedValue(true);

    const req = { params: { id: "1" } } as unknown as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;
    const next = jest.fn() as NextFunction;

    await userController.deleteUser(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: "User deleted" });
  });
});
