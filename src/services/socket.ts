import { Server } from "socket.io";
import * as notiService from "../services/notiService";
import * as cartService from "../services/cartService";
import { Cart } from "../models/cart";
import { isAuthSocket } from "../middleware/authMiddleware";

export const setupSocket = (io: Server) => {
  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    // socket.on("joinRoom", (userId) => {
    //   socket.join(userId);
    //   console.log(`User ${userId} joined room ${userId}`);
    // });

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

    socket.on("newOrder", async (orderData) => {
      console.log("Received new order:", orderData);

      const notification = await notiService.create(orderData);

      io.emit("orderNotification", orderData);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};
