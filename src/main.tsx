import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import 'bootstrap/dist/css/bootstrap.min.css';
import { MqttProvider } from "./context/MqttContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <MqttProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </MqttProvider>
  </React.StrictMode>
);
