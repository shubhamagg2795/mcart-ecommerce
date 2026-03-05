import { useAuth } from "react-oidc-context";

function Header() {

  const auth = useAuth();

  return (
    <div className="header">
      <div className="container header-inner">

        <h2>MCART</h2>

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