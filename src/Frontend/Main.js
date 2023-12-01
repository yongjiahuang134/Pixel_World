import React from 'react';
import {Link} from 'react-router-dom';
import logo from './logo.jpg'

//Main Page before login/signup
function Main(){
    
    return (
        <div className='MainPage'>
            <h1 className="MainPageh1">Welcome to Pixel World</h1>
            <img src={logo} alt="Logo" className="App-logo" style={{maxWidth: '50%', maxHeight: '50s%'}}></img>
            <h2 className="MainPageh2">Let Begin!</h2>
            <br></br>
            <br></br>
            <br></br>
            <button class="button"><Link to='/login'>Login</Link></button>
            <button class="button"><Link to='/signup'>Signup</Link></button>
        </div>
    );
}

export default Main;