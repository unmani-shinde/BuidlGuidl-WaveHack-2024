import React from "react";
import ReactDOM from "react-dom/client";
//import App from "./App.jsx";
import { BrowserRouter as Router,Routes,Route } from "react-router-dom";
import "./index.css";
import Home from "./App.jsx";
import GetStarted from "./new-routes/GetStarted.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/get-started" element={<GetStarted/>}/>
      </Routes>
      
    </Router>
  
  </React.StrictMode>
);
