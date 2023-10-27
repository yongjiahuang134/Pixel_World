
import React, {useState} from 'react';
import axios from 'axios';

export const Login = (props) => {

    const [username, setusername] = useState('');
    const [pass, setpass] = useState('');
    //set up backend server
    async function handleSubmit(e) {
        e.preventDefault();
        console.log(username);
        try{
            await axios.post("http://localhost:3000/", {
                username, pass
            })
        }
        catch(e){
            console.log(e);
        }

    }

    return (
        <div className="auth-form">
            <h1>Welcome to Pixel ....???(Name)</h1>
            <h1>Log In</h1>
            <form action="POST" className="login-form" onSubmit={handleSubmit}>
                <label htmlFor="username"> Username: </label>
                <input value={username} onChange={(e) => setusername(e.target.value)} type="text" placeholder="joebruin" id="username" name="username" />
                <label htmlFor="password"> Password: </label>
                <input value={pass} onChange={(e) => setpass(e.target.value)} type="password" placeholder="********" id="password" name="password" />
                <button class="button" type="submit"><span>Log In</span></button>
            </form>
            <button className="link-button" onClick={() => {props.onFormSwitch('sign up')}}>Don't have an account? Click here to sign up!</button>
        </div>
    )
}