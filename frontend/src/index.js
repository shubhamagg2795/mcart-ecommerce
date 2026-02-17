import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "react-oidc-context";
import { WebStorageStateStore } from "oidc-client-ts";

const cognitoAuthConfig = {
  authority:
    "https://cognito-idp.ap-south-1.amazonaws.com/ap-south-1_w11q1SuUr",
  client_id: "5itpocjgtbnrbktndqpqpn1ivm",
  redirect_uri: "https://d1koynn5e9sgkm.cloudfront.net",
  post_logout_redirect_uri: "https://d1koynn5e9sgkm.cloudfront.net/",
  response_type: "code",
  scope: "openid email phone",

  userStore: new WebStorageStateStore({
    store: window.localStorage,
  }),

  // 🔥 THIS FIXES REFRESH ISSUE
  onSigninCallback: () => {
    window.history.replaceState(
      {},
      document.title,
      window.location.pathname
    );
  },
};

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <AuthProvider {...cognitoAuthConfig}>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
