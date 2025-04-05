import { useNotification } from "../snackbar/NotificationContext";

export const useNotify = () => {
  const notification = useNotification();

  return {
    updateSuccess: (title) =>
      notification(`Cập nhật ${title} thành công!`, "success"),
    deleteSuccess: (title) =>
      notification(`Xoá ${title} thành công!`, "success"),
    createSuccess: (title) =>
      notification(`${title} đã được tạo thành công!`, "success"),
  };
};
