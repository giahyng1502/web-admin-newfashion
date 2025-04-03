export const utilVietnamDong = (money) => {
    if (typeof money !== "number") {
        return "0 VND";
    }
    return new Intl.NumberFormat('vi-VN').format(Math.round(money)) + ' VND';
};
