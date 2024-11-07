import { Notification } from "../models/notification";

export const create = async (data: Notification): Promise<Notification> => {
  const notification = new Notification(data);
  return notification.save();
};

export const getUnreadCount = async () => {
  return await Notification.countDocuments({ isRead: false });
};
