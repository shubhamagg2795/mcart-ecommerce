import { useAuth } from "react-oidc-context";

function Header() {

  const auth = useAuth();

  return (
    <div style={{ padding:"12px", background:"#222", color:"#fff" }}>

      <h2>MCART E-Commerce</h2>

      <button onClick={() => auth.signoutRedirect()}>
        Logout
      </button>

    </div>
  );
}

export default Header;