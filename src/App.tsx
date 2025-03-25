import { BrowserRouter, Route, Routes,  } from "react-router-dom";
import Landing from "./components/Landing";
import Navbar from "./components/Navbar";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="Navbar" element={<Navbar />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
