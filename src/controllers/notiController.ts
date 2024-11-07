import * as notiService from "../services/notiService";

export const getUnreadCount = async () => {
  return await notiService.getUnreadCount();
};
