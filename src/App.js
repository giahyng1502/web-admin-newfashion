import { ColorModeContext, useMode } from "./theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import TopBar from "./global/top-bar";
import {Route, Routes} from "react-router-dom";
import Product from "./screen/dashboard/product";
import Team from "./screen/dashboard/team";
import Category from "./screen/dashboard/category";
import Order from "./screen/dashboard/order";
import Newfeed from "./screen/dashboard/newfeed";
import MySidebar from "./global/side-bar";

function App() {
  const [theme, colorMode] = useMode();
  return (
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <div className="app">
              <MySidebar/>
            <main className="content">
              <TopBar />
                <Routes>
                    <Route path={'/product'} element={<Product />}/>
                    <Route path={'/team'} element={<Team />}/>
                    <Route path={'/category'} element={<Category />}/>
                    <Route path={'/order'} element={<Order />}/>
                    <Route path={'/newfeed'} element={<Newfeed />}/>
                </Routes>
            </main>
          </div>
        </ThemeProvider>
      </ColorModeContext.Provider>
  );
}

export default App;
