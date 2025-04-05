import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Button,
  TextField,
  Box,
  Typography,
  useTheme,
  Paper,
  CircularProgress,
} from "@mui/material";
import {
  loginStart,
  loginSuccess,
  loginFailure,
} from "../redux/reducer/authReducer";
import { tokens } from "../theme";
import { useNotification } from "../snackbar/NotificationContext";
import axios from "../apis/axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loading = useSelector((state) => state.auth.loading);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const showNotification = useNotification();

  const handleLogin = async () => {
    dispatch(loginStart()); // Bắt đầu loading
    try {
      const res = await axios.post("/users/login", {
        email,
        password,
      });

      if (res.status === 200) {
        showNotification("Đăng nhập thành công", "success");
        dispatch(loginSuccess(res.data));
        console.log(res.data);
        navigate("/product");
      } else {
        showNotification(
          "Thông tin tài khoản hoặc mật khẩu không chính xác",
          "error"
        );
        dispatch(loginFailure());
      }
    } catch (e) {
      showNotification("Lỗi server", "error");
      dispatch(loginFailure());
      console.log("Lỗi: ", e);
    }
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      width="100%"
      sx={{ backgroundColor: colors.primary[500] }}
    >
      <Paper
        elevation={3}
        sx={{
          width: "50%",
          p: 4,
          backgroundColor: colors.primary[400],
          borderRadius: 4,
          boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.2)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography
          variant="h4"
          fontWeight="bold"
          color={colors.grey[100]}
          gutterBottom
        >
          Đăng nhập
        </Typography>

        <TextField
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          margin="normal"
          sx={{ backgroundColor: colors.grey[800], borderRadius: 1 }}
        />
        <TextField
          label="Mật khẩu"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          margin="normal"
          sx={{ backgroundColor: colors.grey[800], borderRadius: 1 }}
        />

        <Button
          variant="contained"
          onClick={handleLogin}
          fullWidth
          sx={{
            mt: 3,
            p: 1.5,
            backgroundColor: colors.blueAccent[400],
            borderRadius: 2,
            fontSize: "1rem",
            fontWeight: "bold",
            transition: "0.3s",
            "&:hover": {
              backgroundColor: colors.blueAccent[600],
              transform: "scale(1.05)",
            },
          }}
          disabled={loading}
        >
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Đăng nhập"
          )}
        </Button>
      </Paper>
    </Box>
  );
};

export default Login;
