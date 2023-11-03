import './App.css';
import { Login } from './auth/Login';
import { Signup } from './auth/Signup';
import Main from './Frontend/Main';
import { BrowserRouter as Router,  Routes,  Route } from "react-router-dom";
import Home from './Frontend/Home';

function App() {
  
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/login" element={<Login/>}/>
          <Route path="/" element={<Main/>}/>
          <Route path="/signup" element={<Signup/>}/>
          <Route path="/home" element={<Home/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;