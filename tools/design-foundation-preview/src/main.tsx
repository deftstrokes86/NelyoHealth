import React from "react";
import { createRoot } from "react-dom/client";
import "@nelyohealth/ui-foundation/styles.css";
import "./preview.css";
import { App } from "./App";
const root = document.getElementById("root");
if (!root) throw new Error("Preview root missing");
createRoot(root).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
