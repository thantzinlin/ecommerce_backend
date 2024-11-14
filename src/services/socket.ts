import { Server } from "socket.io";
import * as notiService from "../services/notiService";
import * as cartService from "../services/cartService";
import { Cart } from "../models/cart";

export const setupSocket = (io: Server) => {
  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("addToCart", (userId, product) => {
      console.log("add to cart emitted", socket.id);
      const cartData = {
        userId: userId,
        products: [
          {
            productId: product.productId,
            quantity: 1,
          },
        ],
      };
      const cart1 = new Cart(cartData);

      const cart = cartService.create(cart1);
      io.to(userId).emit("updateCartCount", 11);
    });

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
