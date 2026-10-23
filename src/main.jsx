import React from "react";
import ReactDOM from "react-dom/client";
import { AppProviders } from "@/app/providers/AppProviders.jsx";
import App from "@/app/App.jsx";
import "@/styles/index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AppProviders>
      <App />
    </AppProviders>
  </React.StrictMode>,
);
