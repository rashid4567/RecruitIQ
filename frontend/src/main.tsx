import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Toaster } from "sonner";
import App from "./App";
import "./index.css";

const googleid = import.meta.env.VITE_GOOGLE_CLIENT_ID;

console.log("google id : ", googleid);
console.log(import.meta.env.VITE_API_URL)


createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={googleid}>
      <App />
      <Toaster
        position="top-right"
        richColors
        closeButton
        duration={3000}
      />
    </GoogleOAuthProvider>
  </StrictMode>
);
