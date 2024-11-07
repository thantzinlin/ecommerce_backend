import { Server } from "socket.io";

export const setupSocket = (io: Server) => {
  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    // socket.on("join", (userId) => {
    //   socket.join(userId);
    //   console.log(`User ${userId} joined room ${userId}`);
    // });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};
