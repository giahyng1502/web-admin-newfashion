import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import "dayjs/locale/vi";

dayjs.extend(localizedFormat);
dayjs.locale("vi");

export function formatDateTime(input) {
  return dayjs(input).format("D [Tháng] M, YYYY [lúc] HH:mm");
}
