import { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { GlobalContext } from '../GlobalContext';

function Login(props) {
    const { setUserUuid } = useContext(GlobalContext);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    function logMeIn(e) {
        e.preventDefault();

        axios({
            method: "POST",
            url: "http://127.0.0.1:5000/token",
            data: {
                email: email,
                password: password
            }
        })
        .then ((response) => {
            props.setToken(response.data.access_token);
            setUserUuid(response.data.uuid);
            localStorage.setItem("user_uuid", response.data.uuid);
            localStorage.setItem("username", response.data.username);
            navigate("/dashboard");

        }).catch((error) => {
            if (error.response) {
                console.log(error.response)
                console.log(error.response.status)
                console.log(error.response.headers)
                }
            });
            setEmail("");
            setPassword("");
            
        }

    return(
        <>
            <div className="login-page">
                <div className="form">
                    <form className="login-form" onSubmit={logMeIn}>
                    <p className="message">Structor TS prosjekter</p>
                        <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="E-post" />
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Passord" />
                        <button>Logg inn</button>
                        <p className="message">Kontakt admin hvis du mangler konto<br/>torbjorn.stensrud@structor.no</p>
                    </form>
                </div>
            </div>
        </> 
    );
}

export default Login