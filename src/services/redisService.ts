// redisService.ts
import { redis } from "../config/redisConfig";

export const getAvailableSeats = async (classId: string): Promise<number> => {
  try {
    const availableSeats = await redis.get(`class:${classId}:availableSeats`);
    if (availableSeats === null || isNaN(Number(availableSeats))) {
      return 5; // Default value
    }
    return parseInt(availableSeats, 10);
  } catch (err) {
    console.error("Error fetching available seats from Redis:", err);
    return 5;
  }
};

// export const updateAvailableSeats = async (
//   classId: string,
//   seats: number
// ): Promise<void> => {
//   if (isNaN(seats) || seats < 0) return;

//   try {
//     await redis.set(`class:${classId}:availableSeats`, seats.toString());
//   } catch (err) {
//     console.error("Error updating available seats in Redis:", err);
//   }
// };

// export const initializeClassSeats = async (
//   classIds: string[],
//   initialSeats: number
// ): Promise<void> => {
//   const promises = classIds.map(async (classId) => {
//     try {
//       await redis.set(`class:${classId}:availableSeats`, initialSeats);
//     } catch (err) {
//       console.error(`Error setting seats for class: ${classId}`, err);
//     }
//   });

//   await Promise.all(promises);
// };
