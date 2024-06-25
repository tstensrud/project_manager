import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login(props) {

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
            props.setToken(response.data.access_token)
            navigate("/projects");

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
            <div className="login-div-container">
                <div>
                    <h1 className="app-content-subTitleheaderText">Structor TS romskjema</h1>
                </div>
                <p className="p-menu-item"></p>
                <div>
                <form onSubmit={logMeIn} className="custom-form profile-form" method="POST" role="form" action="">
                    <input className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="e-mail" /> <br />
                    <input className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="passord" />
                    <p>
                        <button type="submit" className="form-button">
                            Logg inn
                        </button>
                    </p>
                </form>
            </div>
        </div >
        </> 
    );
}

export default Login