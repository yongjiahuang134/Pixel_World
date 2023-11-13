import React, {useState} from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

export const Signup = (props) => {
    const [username, setusername] = useState('');
    const [pass, setpass] = useState('');
    const history = useNavigate();
    //set up backend server
    async function handleSubmit(e) {
        e.preventDefault();
        try{
            await axios.post("http://localhost:8001/signup", {
                username, pass
            }).then(res=>{
                if(res.data==="exist"){
                    alert("User already have an account");
                }
                else if (res.data==="not exist"){
                    history("/home");
                }
            }).catch(e=>{
                alert("wrong");
                console.log(e);
            })
        }
        catch(e){
            console.log(e);
        }

    }

    return (
        <div className="auth-form">
            <h1>Sign Up</h1>
            <form className="signup-form" onSubmit={handleSubmit}>
                <label htmlFor="username"> Username: </label>
                <input value={username} onChange={(e) => setusername(e.target.value)} type="text" placeholder="joebruin" id="username" name="username" />
                <label htmlFor="password"> Password: </label>
                <input value={pass} onChange={(e) => setpass(e.target.value)} type="password" placeholder="********" id="password" name="password" />
                <button class="button" type="submit"><span>Sign Up</span></button>
            </form>
            <Link to='/login'>Already have an account? Log In here!</Link>
            
        </div>
    );
}