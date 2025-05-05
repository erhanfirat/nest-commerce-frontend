import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Box, CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginPage from "./features/auth/LoginPage";
import ProductList from "./features/products/ProductList";
import ProductForm from "./features/products/ProductForm";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Box
          sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
        >
          <Navbar />
          <Box component="main" sx={{ flexGrow: 1, py: 3 }}>
            <Routes>
              <Route path="/" element={<ProductList />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/products" element={<ProductList />} />

              {/* Protected Routes */}
              <Route
                element={
                  <ProtectedRoute
                    allowedRoles={["admin", "superadmin", "seller"]}
                  />
                }
              >
                <Route path="/products/new" element={<ProductForm />} />
                <Route path="/products/edit/:id" element={<ProductForm />} />
              </Route>

              {/* Admin Routes */}
              <Route
                element={
                  <ProtectedRoute allowedRoles={["admin", "superadmin"]} />
                }
              >
                <Route path="/admin/*" element={<div>Admin Dashboard</div>} />
              </Route>

              {/* Seller Routes */}
              <Route element={<ProtectedRoute allowedRoles={["seller"]} />}>
                <Route path="/seller/*" element={<div>Seller Dashboard</div>} />
              </Route>

              {/* User Routes */}
              <Route element={<ProtectedRoute allowedRoles={["user"]} />}>
                <Route path="/orders" element={<div>Orders</div>} />
                <Route path="/profile" element={<div>Profile</div>} />
              </Route>
            </Routes>
          </Box>
        </Box>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
