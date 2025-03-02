import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Unauthorized = () => {
    const navigate = useNavigate();

    return (
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100vh">
            <Typography variant="h4" color="error" gutterBottom>
                Bạn không có quyền truy cập trang này!
            </Typography>
            <Button variant="contained" color="primary" onClick={() => navigate("/login")}>
                Quay lại trang chủ
            </Button>
        </Box>
    );
};

export default Unauthorized;
