import { Server } from "socket.io";
import * as notiService from "../services/notiService";
import * as cartService from "../services/cartService";
import { Cart } from "../models/cart";
import { isAuthSocket } from "../middleware/authMiddleware";

export const setupSocket = (io: Server) => {
  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("joinRoom", (roomName) => {
      console.log(`Socket ${socket.id} joining room: ${roomName}`);
      socket.join(roomName);
      console.log(`Socket ${socket.id} joined rooms: `, socket.rooms); // Debug log
    });

    // socket.on("addToCart", async (userId, product) => {
    //   console.log("add to cart emitted", socket.id);
    //   const cartData = {
    //     userId: userId,
    //     products: [
    //       {
    //         productId: product.productId,
    //         quantity: 1,
    //       },
    //     ],
    //   };
    //   const data = new Cart(cartData);

    //   cartService.create(data);
    //   const count = await cartService.getItemCart(userId);
    //   io.to(userId).emit("updateCartCount", count);
    // });

    // socket.on("newOrder", async (orderData) => {
    //   try {
    //     console.log("Received new order:", orderData);

    //     const notification = await notiService.create(orderData);

    //     io.emit("orderNotification", orderData);
    //   } catch (error) {
    //     console.error("Error handling new order:", error);
    //   }
    // });

    // socket.on("disconnect", () => {
    //   console.log("User disconnected:", socket.id);
    // });
  });
};
