import { useState } from "react";
import { useAuth } from "react-oidc-context";

// Cognito config — same values as index.js
const COGNITO_REGION = "ap-south-1";
const COGNITO_CLIENT_ID = "5itpocjgtbnrbktndqpqpn1ivm";
const COGNITO_ENDPOINT = `https://cognito-idp.${COGNITO_REGION}.amazonaws.com/`;

function Login() {
  const auth = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Call Cognito USER_PASSWORD_AUTH directly — no redirect to AWS hosted UI
      const response = await fetch(COGNITO_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-amz-json-1.1",
          "X-Amz-Target": "AWSCognitoIdentityProviderService.InitiateAuth",
        },
        body: JSON.stringify({
          AuthFlow: "USER_PASSWORD_AUTH",
          ClientId: COGNITO_CLIENT_ID,
          AuthParameters: {
            USERNAME: email,
            PASSWORD: password,
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const code = data.__type || "";
        if (code.includes("NotAuthorizedException")) {
          throw new Error("Incorrect email or password.");
        } else if (code.includes("UserNotFoundException")) {
          throw new Error("No account found with this email.");
        } else if (code.includes("UserNotConfirmedException")) {
          throw new Error("Please verify your email before signing in.");
        } else {
          throw new Error(data.message || "Login failed. Please try again.");
        }
      }

      // Cognito returned tokens — store them and update auth state
      const { IdToken, AccessToken, RefreshToken } =
        data.AuthenticationResult;

      // Store tokens using the same key react-oidc-context uses internally
      const userKey = `oidc.user:https://cognito-idp.${COGNITO_REGION}.amazonaws.com/ap-south-1_w11q1SuUr:${COGNITO_CLIENT_ID}`;

      // Decode IdToken payload (JWT middle section is base64)
      const payload = JSON.parse(atob(IdToken.split(".")[1]));

      const oidcUser = {
        id_token: IdToken,
        access_token: AccessToken,
        refresh_token: RefreshToken,
        token_type: "Bearer",
        scope: "openid email phone",
        profile: {
          sub: payload.sub,
          email: payload.email,
          email_verified: payload.email_verified,
          phone_number: payload.phone_number,
        },
        expires_at: payload.exp,
      };

      localStorage.setItem(userKey, JSON.stringify(oidcUser));

      // Reload so react-oidc-context picks up the stored tokens
      window.location.reload();

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">

        <div className="login-logo">
          M<span>CART</span>
        </div>
        <p className="login-subtitle">Sign in to your account</p>

        {error && (
          <div className="login-error">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleLogin}>

          <div className="form-group">
            <label>Email address</label>
            <input
              type="email"
              required
              autoFocus
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                disabled={loading}
                style={{ paddingRight: "48px" }}
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                style={{
                  position: "absolute", right: "12px", top: "50%",
                  transform: "translateY(-50%)", background: "none",
                  border: "none", cursor: "pointer", fontSize: "16px",
                  color: "#888", padding: 0,
                }}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn-login"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

        </form>

        <div className="login-divider">
          <span>or</span>
        </div>

        <button
          type="button"
          className="btn-login-sso"
          onClick={() => auth.signinRedirect()}
          disabled={loading}
        >
          Continue with Google / SSO
        </button>

        <p className="login-footer">
          Don't have an account?{" "}
          <span onClick={() => auth.signinRedirect()}>Sign up</span>
        </p>

        <p style={{
          textAlign: "center", marginTop: "16px",
          fontSize: "11px", color: "#bbb",
        }}>
          🔒 Secured by AWS Cognito
        </p>

      </div>
    </div>
  );
}

export default Login;
