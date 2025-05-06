import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "./app/store";
import { refreshToken } from "./features/auth/authSlice";
import { fetchCart } from "./features/cart/cartSlice";
import Navbar from "./components/Navbar";
import ProductList from "./features/products/ProductList";
import ProductDetail from "./features/products/ProductDetail";
import CartPage from "./features/cart/CartPage";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginPage from "./features/auth/LoginPage";
import RegisterPage from "./features/auth/RegisterPage";

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const { token } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const initializeApp = async () => {
      if (token) {
        try {
          await dispatch(refreshToken()).unwrap();
          await dispatch(fetchCart()).unwrap();
        } catch (error) {
          console.error("Otomatik giriş başarısız:", error);
        }
      }
    };

    initializeApp();
  }, [dispatch, token]);

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<ProductList />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/products" element={<ProductList />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route
              path="/cart"
              element={
                <ProtectedRoute allowedRoles={["user", "admin", "seller"]}>
                  <CartPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
