import { Category } from "../models/category";
import { Notification } from "../models/notification";
import { formatDateToAMPM } from "../utils/utilFunctions";

export const create = async (data: Notification): Promise<Notification> => {
  const notification = new Notification(data);
  return notification.save();
};

export const getUnreadCount = async () => {
  return Notification.countDocuments({ isRead: false });
};

export const getAllNotification = async (
  type: string
): Promise<{
  data: any[];
  total: number;
}> => {
  const query: any = { isDeleted: false, type };

  const total = await Notification.countDocuments(query);
  const data = await Notification.find(query)
    .select("message createdAt")
    .sort({ createdAt: -1 })
    .exec();

  const formattedData = data.map((notification) => ({
    ...notification.toObject(),
    createdAt: formatDateToAMPM(notification.createdAt),
  }));

  return {
    data: formattedData,
    total,
  };
};
