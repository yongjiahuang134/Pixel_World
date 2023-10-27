
import React, {useState} from 'react';
import './App.css';
import { Login } from './auth/Login';
import { Signup } from './auth/Signup'; 

function App(){
  const [currentForm, setCurrentForm] = useState('login');

  const switchform = (formName) => {
    setCurrentForm(formName);
  }

  return (
    <div className="App">
      {
        currentForm === 'login' ? <Login onFormSwitch={switchform}/> : <Signup onFormSwitch={switchform}/>
      }
    </div>
  );
}

export default App;
