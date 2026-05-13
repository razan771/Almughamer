import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { Header } from './components/Header';
import { CartDrawer } from './components/CartDrawer';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Pharmacy } from './pages/Pharmacy';
import { Admin } from './pages/Admin';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Profile } from './pages/Profile';
import { Checkout } from './pages/Checkout';
import { AuthProvider } from './AuthContext';
import { api } from './api';
import type { Product } from './components/ProductCard';

export function AppContent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<(Product & { quantity: number })[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch products
    api.getProducts().then(setProducts).catch(console.error);
  }, []);

  const handleRemoveItem = (id: string) => setCartItems(items => items.filter(i => i.id !== id));
  const handleUpdateQuantity = (id: string, quantity: number) => setCartItems(items => items.map(i => i.id === id ? { ...i, quantity } : i));
  const handleAddToCart = (product: Product) => {
    setCartItems(items => {
      const existing = items.find(i => i.id === product.id);
      if (existing) {
        return items.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...items, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  }

  const handleCheckoutNav = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  }

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="app-bg min-h-screen flex flex-col bg-background text-on-surface font-body">
      <Header cartCount={cartCount} onOpenCart={() => setIsCartOpen(true)} />
      
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/pharmacy" element={<Pharmacy products={products} onAddToCart={handleAddToCart} />} />
          <Route path="/checkout" element={<Checkout items={cartItems} clearCart={() => setCartItems([])} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>

      <Footer />

      <CartDrawer 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onRemoveItem={handleRemoveItem}
        onUpdateQuantity={handleUpdateQuantity}
        onCheckout={handleCheckoutNav}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}
