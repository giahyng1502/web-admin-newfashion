import { useSelector } from "react-redux";
import {useNotification} from "./snackbar/NotificationContext";
import {Navigate} from "react-router-dom";

const PrivateRoute = ({ children }) => {
    const role = useSelector((state) => state.auth.role);
    const showNotification = useNotification();

    if (role === 0) {
        showNotification("Bạn không có quyền truy cập trang này!", "error");
        return <Navigate to="/unauthorized" />;
    }

    return children;

};

export default PrivateRoute;
