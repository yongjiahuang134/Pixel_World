import React from 'react';
import {useLocation, useNavigate} from 'react-router-dom';

//Main Page after login/signup
function Main(){
    const location = useLocation();
    
    return (
        <div className='MainPage'>
            <h1> Hello, This is main page</h1>
        </div>
    );
}