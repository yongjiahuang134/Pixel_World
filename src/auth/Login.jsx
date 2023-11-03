
import React, {useState} from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

export const Login = (props) => {
    const [username, setusername] = useState('');
    const [pass, setpass] = useState('');
    const history = useNavigate();

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
                <input value={username} onChange={(e) => setusername(e.target.value)} type="text" placeholder="joebruin" id="username" name="username" />
                <label htmlFor="password"> Password: </label>
                <input value={pass} onChange={(e) => setpass(e.target.value)} type="password" placeholder="********" id="password" name="password" />
                <button class="button" type="submit"><span>Log In</span></button>
            </form>
            <Link to='/signup'>Don't have an account? Click here to sign up!</Link>
        </div>
    )
}