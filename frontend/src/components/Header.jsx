import { useAuth } from "react-oidc-context";
import { useEffect, useState } from "react";
import { getBackendVersion } from "../services/api";

function Header() {

  const auth = useAuth();
  const [backendVersion, setBackendVersion] = useState("");

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

  return (
    <div className="header">
      <div className="container header-inner">

        <h2>MCART</h2>

        {/* 👇 Deployment info */}
        <div style={{fontSize:"12px", color:"gray"}}>
          Backend: {backendVersion} | React: v1
        </div>

        <div>
          {auth.user?.profile?.email}

          <button
            style={{marginLeft: "20px"}}
            onClick={() => auth.removeUser()}
          >
            Logout
          </button>
        </div>

      </div>
    </div>
  );
}

export default Header;