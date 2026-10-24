import React from "react";
import ReactDOM from "react-dom/client";
import { AppProviders } from "@/app/providers/AppProviders.jsx";
import App from "@/app/App.jsx";
// Fuentes alojadas en la app (HU-F-312): sin Google Fonts bloqueando el primer render.
// Solo los pesos que usa el sistema de diseño; font-display: swap viene en cada @font-face.
import "@fontsource-variable/inter/wght.css";
import "@fontsource/baloo-2/latin-600.css";
import "@fontsource/ibm-plex-mono/latin-400.css";
import "@fontsource/ibm-plex-mono/latin-500.css";
import "@/styles/index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AppProviders>
      <App />
    </AppProviders>
  </React.StrictMode>,
);
