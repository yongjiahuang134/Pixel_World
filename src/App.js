import './App.css';
import { Login } from './auth/Login';
import { Signup } from './auth/Signup';
import Main from './Frontend/Main';
import { BrowserRouter as Router,  Routes,  Route } from "react-router-dom";
import Home from './Frontend/Home';
import ImagesList from './Backend/ImagesList';
import Script from './script';

function App() {
  
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/login" element={<Login/>}/>
          <Route path="/" element={<Main/>}/>
          <Route path="/signup" element={<Signup/>}/>
          <Route path="/home/:username" element={<Home/>}/>
          <Route path="/images/:username" element={<ImagesList/>} />
          <Route path="/script" element={<Script/>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;