import { useAuth } from "react-oidc-context";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getBackendVersion } from "../services/api";

function Header() {
  const auth = useAuth();
  const navigate = useNavigate();
  const [backendVersion, setBackendVersion] = useState("Loading...");
  const [guid, setGuid] = useState(localStorage.getItem("demo-guid") || "");

  useEffect(() => {
    const fetchVersion = async () => {
      try {
        const version = await getBackendVersion();
        setBackendVersion(version);
      } catch (e) {
        setBackendVersion("Backend unavailable");
      }
    };
    fetchVersion();
  }, []);

  const handleGuidChange = (e) => {
    const val = e.target.value;
    setGuid(val);
    localStorage.setItem("demo-guid", val);
  };

  return (
    <header className="header">
      <div className="header-inner">

        {/* Logo */}
        <div className="header-logo" onClick={() => navigate("/")}>
          M<span>CART</span>
        </div>

        {/* Deployment info + GUID field — the key part for CI/CD demo */}
        <div className="header-meta">
          <div>Backend: {backendVersion} | React: v2</div>
          <div className="guid-row">
            Demo GUID:&nbsp;
            <input
              value={guid}
              onChange={handleGuidChange}
              placeholder="Paste GUID here..."
              style={{
                background: "transparent",
                border: "1px solid #555",
                borderRadius: "4px",
                color: "#f0a500",
                fontSize: "12px",
                padding: "2px 8px",
                width: "200px",
                outline: "none"
              }}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="header-actions">
          <span className="header-email">{auth.user?.profile?.email}</span>
          <button className="btn-cart" onClick={() => navigate("/cart")}>
            🛒 Cart
          </button>
          <button className="btn-logout" onClick={() => auth.removeUser()}>
            Logout
          </button>
        </div>

      </div>

      {/* Nav */}
      <nav className="nav-bar">
        <div className="nav-inner">
          <span className="nav-link" onClick={() => navigate("/")}>Home</span>
          <span className="nav-link" onClick={() => navigate("/search")}>All Products</span>
          <span className="nav-link" onClick={() => navigate("/search?q=smartphone")}>Smartphones</span>
          <span className="nav-link" onClick={() => navigate("/search?q=laptop")}>Laptops</span>
          <span className="nav-link" onClick={() => navigate("/search?q=headphones")}>Headphones</span>
          <span className="nav-link" onClick={() => navigate("/search?q=camera")}>Cameras</span>
        </div>
      </nav>
    </header>
  );
}

export default Header;
