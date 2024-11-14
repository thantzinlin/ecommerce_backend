import { Category } from "../models/category";
import { Notification } from "../models/notification";

export const create = async (data: Notification): Promise<Notification> => {
  const notification = new Notification(data);
  return notification.save();
};

export const getUnreadCount = async () => {
  return Notification.countDocuments({ isRead: false });
};
