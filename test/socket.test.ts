// tests/socket.test.ts
import request from "supertest";
import { Server } from "socket.io";
import http from "http";
import app from "../src/app"; // Adjust the path based on your structure

describe("Socket.IO Tests", () => {
  let server: http.Server;
  let io: Server;

  beforeAll((done) => {
    server = http.createServer(app);
    io = new Server(server);
    server.listen(3001, done);
  });

  afterAll((done) => {
    io.close();
    server.close(done);
  });

  it("should broadcast messages to connected clients", (done) => {
    const client1 = require("socket.io-client")("http://localhost:5000");
    const client2 = require("socket.io-client")("http://localhost:5000");

    client1.on("connect", () => {
      client2.on("connect", () => {
        client1.emit("chat message", "Hello World");

        client2.on("chat message", (msg: any) => {
          expect(msg).toBe("Hello World");
          client1.disconnect();
          client2.disconnect();
          done();
        });
      });
    });
  }, 10000); // Increased timeout to 10 seconds
});
