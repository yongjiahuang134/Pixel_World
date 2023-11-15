
import React, {useState} from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

export const Login = (props) => {
    const [username, setusername] = useState('');
    const [pass, setpass] = useState('');
    const history = useNavigate();
    function checkValidUsername() {
        let textbox = document.getElementById('username');
        let errorSpan = document.getElementById('error');
    
        if (textbox.value.length === 0) {
          errorSpan.textContent = 'Need to input something for your username';
          textbox.style.border = '1px solid #FF0000'; // Apply red border
        } else if (!/^[a-zA-Z0-9]+$/.test(textbox.value)) {
            errorSpan.textContent = 'Username can only contain letters and numbers';
        } else {
          errorSpan.textContent = ''; // Clear error message
          textbox.style.border = '1px solid #ced4da'; // Reset border to default
        }

    }
    function checkValidPass(){
        let textbox = document.getElementById('password');
        let errorSpan = document.getElementById('errorpass');
    
        if (textbox.value.length === 0) {
          errorSpan.textContent = 'Need to input something for your Password';
          textbox.style.border = '1px solid #FF0000'; // Apply red border
        } else if (!/^[a-zA-Z0-9]+$/.test(textbox.value)) {
            errorSpan.textContent = 'Password can only contain letters and numbers';
        } else {
          errorSpan.textContent = ''; // Clear error message
          textbox.style.border = '1px solid #ced4da'; // Reset border to default
        }

    }
    //set up backend server
    async function handleSubmit(e) {
        e.preventDefault();
        try{
            await axios.post("http://localhost:8001/login", {
                username, pass
            }).then(res=>{
                if(res.data==="Success"){
                    history("/home");
                }
                else if (res.data==="Password not match"){
                    alert("Incorrect Password");
                }
                else if (res.data === "not exist"){
                    alert("Username not exist, please sign up");
                }
            }).catch(e=>{
                alert("wrong");
                console.log(e);
            })
        }
        catch(e){
            console.log(e);
        }

    };

    

    return (
        <div className="auth-form">
            <h1>Welcome to Pixel ....???(Name)</h1>
            <h1>Log In</h1>
            <form action="POST" className="login-form" onSubmit={handleSubmit}>
                <label htmlFor="username"> Username: </label>
                <input value={username} onChange={(e) => setusername(e.target.value)} type="text" placeholder="joebruin" id="username" name="username" onKeyUp={checkValidUsername}/>
                <span style={{ color: '#FF0000' }} id='error'></span>
                <label htmlFor="password"> Password: </label>
                <input value={pass} onChange={(e) => setpass(e.target.value)} type="password" placeholder="********" id="password" name="password" onKeyUp={checkValidPass}/>
                <span style={{ color: '#FF0000' }} id='errorpass'></span>
                <button class="button" type="submit"><span>Log In</span></button>
            </form>
            <Link to='/signup'>Don't have an account? Click here to sign up!</Link>
        </div>
    )
}