import { getAvailableSeats } from "../services/redisService";
import { Request, Response } from "express";

import { Booking } from "../models/book";
import { redis } from "../config/redisConfig";

export const createBooking = async (req: Request, res: Response) => {
  const { userId, classId, seatsRequested } = req.body;

  try {
    await redis.watch(`class:${classId}:availableSeats`);

    const availableSeats = await getAvailableSeats(classId);

    console.log(`Avaliable Seats : ` + availableSeats);
    if (seatsRequested > availableSeats) {
      return res.status(400).json({ message: "Not enough available seats." });
    }

    const transaction = redis.multi();
    const updatedseats = availableSeats - seatsRequested;
    console.log(`Updated   Seats into memory: ` + updatedseats);

    transaction.set(`class:${classId}:availableSeats`, updatedseats.toString());
    const results = await transaction.exec();

    if (results) {
      const newBooking = new Booking({
        userId,
        classId,
        seatsBooked: seatsRequested,
      });

      try {
        await newBooking.save();

        return res.status(201).json({ message: "Booking successful" });
      } catch (dbError) {
        console.error("Booking save failed:", dbError);
        await redis.watch(`class:${classId}:availableSeats`);
        const rollbackTransaction = redis.multi();
        rollbackTransaction.set(
          `class:${classId}:availableSeats`,
          availableSeats.toString()
        );
        await rollbackTransaction.exec();
        return res
          .status(500)
          .json({ message: "Booking save failed, transaction reverted." });
      }
      return res.status(201).json({ message: "Booking successful" });
    } else {
      return res
        .status(400)
        .json({ message: "Could not update seats, try again." });
    }
  } catch (err) {
    console.error("Error creating booking:", err);
    res.status(500).json({ message: "Server error", error: err });
  }
};
