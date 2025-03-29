import { ColorModeContext, useMode } from "./theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { Route, Routes } from "react-router-dom";
import Product from "./screen/product/product";
import Team from "./screen/dashboard/team";
import Category from "./screen/category/category";
import Order from "./screen/Order/order";
import Newfeed from "./screen/dashboard/newfeed";
import MySidebar from "./global/side-bar";
import TopBar from "./global/top-bar";
import PrivateRoute from "./PrivateRoute";
import Login from "./screen/login";
import {NotificationProvider} from "./snackbar/NotificationContext";
import Unauthorized from "./screen/unauthorized-page";
import AddProduct from "./screen/product/add-product";
import SaleProduct from "./screen/saleProduct/saleProduct";

function App() {
    const [theme, colorMode] = useMode();
    return (
        <NotificationProvider>
        <ColorModeContext.Provider value={colorMode}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <div className="app">
                    <Routes>
                        <Route path="/" element={<Login />} />
                        <Route path="/unauthorized" element={<Unauthorized />} />
                        <Route
                            path="/*"
                            element={
                                <PrivateRoute>
                                    <MySidebar />
                                    <main className="content">
                                        <TopBar />
                                        <Routes>
                                            <Route path="/product" element={<Product />} />
                                            <Route path="/saleProduct" element={<SaleProduct />} />
                                            <Route path="/product/add" element={<AddProduct />} />
                                            <Route path="/user" element={<Team />} />
                                            <Route path="/category" element={<Category />} />
                                            <Route path="/orders" element={<Order />} />
                                            <Route path="/newfeed" element={<Newfeed />} />
                                        </Routes>
                                    </main>
                                </PrivateRoute>
                            }
                        />
                    </Routes>
                </div>
            </ThemeProvider>
        </ColorModeContext.Provider>
        </NotificationProvider>
    );
}

export default App;
