import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useAuth } from "react-oidc-context";
import Header from "./components/Header";
import Login from "./pages/Login";
import Search from "./pages/Search";
import Product from "./pages/Product";

function App() {
  const auth = useAuth();

  if (auth.isLoading) {
    return <div>Loading authentication...</div>;
  }

  if (auth.error) {
    return <div>Error: {auth.error.message}</div>;
  }

  // If not authenticated → redirect to Cognito
  if (!auth.isAuthenticated) {
    auth.signinRedirect();
    return <div>Redirecting to login...</div>;
  }

  // If authenticated → show app
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
