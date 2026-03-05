import "./styles.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useAuth } from "react-oidc-context";
import { useEffect } from "react";

import Header from "./components/Header";
import Login from "./pages/Login";
import Search from "./pages/Search";
import Product from "./pages/Product";

function App() {

  const auth = useAuth();

  useEffect(() => {
    if (!auth.isLoading && !auth.isAuthenticated) {
      auth.signinRedirect();
    }
  }, [auth]);

  if (auth.isLoading) {
    return <div>Loading authentication...</div>;
  }

  if (auth.error) {
    return <div>Error: {auth.error.message}</div>;
  }

  if (!auth.isAuthenticated) {
    return <div>Redirecting to login...</div>;
  }

  return (
    <BrowserRouter>

      <Header />

      <Routes>

        <Route path="/" element={<Search />} />

        <Route path="/login" element={<Login />} />

        <Route path="/product/:id" element={<Product />} />

      </Routes>

    </BrowserRouter>
  );
}

export default App;