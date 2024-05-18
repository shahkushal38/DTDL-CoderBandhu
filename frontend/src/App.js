import "./App.css";
import SideNavbar from "./components/SideNavbar/SideNavbar";
import Home from "./components/Home/Home";
import { Routes, Route } from "react-router-dom";
import TopNav from "./components/TopNav/TopNav";
import Design from "./components/Design/Design";
import Security from "./components/Security/Security";
import Development from "./components/Development/Development";
import Deployment from "./components/Deployment/Deployment";
import CoSpace from "./components/CoSpace/CoSpace";
import { Testing } from "./components/Testing/Testing";

function App() {
  return (
    <div className="App">
      <SideNavbar />

      <div className="right_container">
        <TopNav />
        <div className="right_container_content">
          <Routes>
            <Route path="/design" element={<Design />} />
            <Route path="/development" element={<Development />} />
            <Route path="/testing" element={<Testing />} />
            <Route path="/security" element={<Security />} />
            <Route path="/deployment" element={<Deployment />} />
            <Route path="/cospace" element={<CoSpace />} />
            <Route path="/" element={<Home />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
