import { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { GlobalContext } from '../GlobalContext';
import { BASE_URL } from '../utils/globals.js'
import LoadingSpinner from '../layout/LoadingSpinner.jsx';

function Login(props) {
    const { setUserUuid, setUserName } = useContext(GlobalContext);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    function logMeIn(e) {
        e.preventDefault();
        setLoading(true);

        axios({
            method: "POST",
            url: `${BASE_URL}/token/`,
            data: {
                email: email,
                password: password
            }
        })
            .then((response) => {
                props.setToken(response.data.access_token);
                setUserUuid(response.data.uuid);
                setUserName(response.data.username);
                //localStorage.setItem("user_uuid", response.data.uuid);
                //localStorage.setItem("username", response.data.username);
                navigate("/dashboard");

            }).catch((error) => {
                if (error.response) {
                    console.log(error.response.data)
                    //console.log(error.response.status)
                    //console.log(error.response.headers)
                    setError(error);
                }
            })
            .finally(() => {
                setLoading(false);
            });


        setEmail("");
        setPassword("");

    }

    return (
        <div style={{ display: "flex", width: "100%", height: "100%", justifyContent: "center", textAlign: "center", alignItems: "center" }}>

            {
                loading && loading === true ? (
                    <LoadingSpinner />
                ) : (
                    <div className="card-container">
                        <form onSubmit={logMeIn}>
                            <div style={{ display: "flex", flexDirection: "column" }}>

                                <p className="message">Structor TS prosjekter</p>
                                <p>
                                    <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="E-post" />
                                    </p>
                                    <p>
                                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Passord" />
                                </p>

                                <p><button className="form-button">Logg inn</button></p>
                                <p className="message">Kontakt admin hvis du mangler konto<br />torbjorn.stensrud@structor.no</p>
                                <p>{error && error.response.data ? (<>{error.response.data.error}</>) : ('')}</p>
                            </div>
                        </form>
                    </div>
                )
            }
        </div >
    );
}

export default Login