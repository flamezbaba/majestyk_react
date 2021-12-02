import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login";
import Signup from "./Signup";
import ProcessImage from "./ProcessImage";
import Navbar from "./components/layout/Navbar";

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <div className="container">
          <Routes>
            <Route exact path="/" element={<Login />} />
            <Route exact path="/signup" element={<Signup />} />
            <Route exact path="/process" element={<ProcessImage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
