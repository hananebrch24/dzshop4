import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import PrivateRoute from './components/PrivateRoute'
import HomePage from './pages/HomePage'
import ProductsPage from './pages/ProductsPage'
import CartPage from './pages/CartPage'
import ProductDetailPage from './pages/ProductDetailPage'
import CheckoutPage from './pages/CheckoutPage'
import OrdersPage from './pages/OrdersPage'
import NotFoundPage from './pages/NotFoundPage'
import AdminPage from './pages/AdminPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import { CartProvider } from './context/CartContext'
import { AuthProvider } from './context/AuthContext'
import { ProductsProvider } from './context/ProductsContext'

function App() {
  return (
    <AuthProvider>
    <ProductsProvider>
      <CartProvider>
        <BrowserRouter>

          {/* DEHORS des Routes → visible sur TOUTES les pages */}
          <Navbar />

          {/* DEDANS → une seule s'affiche, selon l'adresse */}
          <Routes>
            <Route path="/"            element={<HomePage />} />
            <Route path="/products"    element={<ProductsPage />} />
            <Route path="/cart"        element={<CartPage />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
            <Route path="/login"       element={<LoginPage />} />
            <Route path="/register"    element={<RegisterPage />} />
            <Route
              path="/checkout"
              element={
                <PrivateRoute>
                  <CheckoutPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/mes-commandes"
              element={
                <PrivateRoute>
                  <OrdersPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <PrivateRoute role="admin">
                  <AdminPage />
                </PrivateRoute>
              }
            />

            {/* toutes les autres adresses → 404 (toujours en dernier) */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>

          <Footer />

        </BrowserRouter>
      </CartProvider>
      </ProductsProvider>
    </AuthProvider>
  )
}

export default App