import "./App.css";
import SideNavbar from "./components/SideNavbar/SideNavbar";
import Home from "./components/Home/Home";
import TopNav from "./components/TopNav/TopNav";
import Design from "./components/Design/Design";
import Security from "./components/Security/Security";

function App() {
  return (
    <div className="App">
      <SideNavbar />
      <TopNav />
      <div className="right_container"></div>
      {/* <div> */}
      
      {/* <Design />
        <Security /> */}
      {/* </div> */}
    </div>
  );
}

export default App;
