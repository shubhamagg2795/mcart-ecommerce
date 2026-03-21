import "./styles.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useAuth } from "react-oidc-context";

import Header from "./components/Header";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Search from "./pages/Search";
import Product from "./pages/Product";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Payment from "./pages/Payment";
import OrderConfirmation from "./pages/OrderConfirmation";

function App() {
  const auth = useAuth();

  if (auth.isLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (auth.error) {
    return (
      <div className="loading-screen">
        <p style={{ color: "#e00" }}>Auth error: {auth.error.message}</p>
        <button className="btn-primary" onClick={() => auth.signinRedirect()}>
          Try Again
        </button>
      </div>
    );
  }

  // KEY CHANGE: show OUR login page instead of redirecting to Cognito hosted UI
  if (!auth.isAuthenticated) {
    return <Login />;
  }

  return (
    <BrowserRouter>
      <Header />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/product/:id" element={<Product />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/order-confirmation" element={<OrderConfirmation />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
