import React from 'react';
import {Link} from 'react-router-dom';

//Main Page before login/signup
function Main(){
    
    return (
        <div className='MainPage'>
            <h1>Welcome to pixel ???</h1>
            <h2>Let Begin!</h2>
            <button class="button"><Link to='/login'>Login</Link></button>
            <button class="button"><Link to='/signup'>Signup</Link></button>
        </div>
    );
}

export default Main;