import React, { useState } from 'react';

import "../../static/index.css";
import "../../static/animations.css";
const Login = () => {
    const [messages, setMessages] = useState([]);

    const handleLogin = async (e) => {
        e.preventDefault();
        const loading = document.getElementById("loadingPing")
        loading.hidden = false;
        const formData = new FormData(e.target);
        formData.append("csrfmiddlewaretoken", document.querySelector('[name=csrfmiddlewaretoken]').value)
        formData.append("user", document.getElementById('user').value)
        formData.append("passwd", document.getElementById('passwd').value)

        fetch("api/login/", {
        method: 'POST',
        body: formData,
        }).then((response) => {
            console.log(response)
            if (!response.ok) {
                document.getElementById('msg').innerHTML = "An error occured, please try again."
            }
            if (response.status == 202) {
                document.location.href = "/"
            }
            setTimeout(() => {  document.getElementById('msg').innerHTML = '' }, 5000);
        }).finally(() => {
            loading.hidden = true;
        }
        )
    }
    return (
        <div className='flex '>
    <div className='flex flex-col w-fit mx-auto mt-2'>
        <h1 className='maxHl'>Login Required</h1>

                <h3 className='mt-5 mb-2'>Enter Credentials:</h3>
                <form onSubmit={handleLogin} className='flex flex-wrap'>
                    <input className='inputElement' type="text" name="account" placeholder="Username" id='user'/>
                    <input className="inputElement mx-2" type="password" name="token" placeholder="Password" id='passwd'/>
                    <br />
                    <button className="inputElement" type="submit">Login</button>
                </form>
                <p id="msg" className='mt-2 text-error'></p>
                <div id="loadingPing" className='loadingPing w-[20px] mt-2 h-[20px] rounded-full bg-error mx-auto' hidden></div>
        </div>
        </div>

    );
};

export default Login;
