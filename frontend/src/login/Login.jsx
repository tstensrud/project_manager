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
        <div className="flex w-full h-full text-dark-primary-color justify-center text-center items-center bg-gradient-to-tr from-dark-tertiary-color to-dark-secondary-color">
            <div className="flex flex-col bg-dark-secondary-color border border-dark-accent-color rounded-lg shadow-lg shadow-background-shade h-1/2">
                <div className="w-full flex justify-end pr-5 pl-5 pt-4">
                    <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" className="stroke-accent-color dark:stroke-dark-accent-color fill-none hover:fill-dark-accent-color" viewBox="0 0 24 24">
                        <path strokeWidth="2" d="M11.083 5.104c.35-.8 1.485-.8 1.834 0l1.752 4.022a1 1 0 0 0 .84.597l4.463.342c.9.069 1.255 1.2.556 1.771l-3.33 2.723a1 1 0 0 0-.337 1.016l1.03 4.119c.214.858-.71 1.552-1.474 1.106l-3.913-2.281a1 1 0 0 0-1.008 0L7.583 20.8c-.764.446-1.688-.248-1.474-1.106l1.03-4.119A1 1 0 0 0 6.8 14.56l-3.33-2.723c-.698-.571-.342-1.702.557-1.771l4.462-.342a1 1 0 0 0 .84-.597l1.753-4.022Z" />
                    </svg>
                </div>
                <div className="p-20">
                    <form onSubmit={logMeIn}>
                        <div className="text-2xl">
                            Structor TS prosjekter
                        </div>
                        <div className="mt-5">
                            <input className="border-2 border-dark-form-border-color bg-dark-form-background-color rounded-3xl w-full pt-2 pb-2 pl-5 pr-5 focus:border-dark-accent-color focus:outline-none hover:border-dark-form-element-hover" type="text" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="E-post" />
                        </div>
                        <div className="mt-3">
                            <input className="border-2 border-dark-form-border-color bg-dark-form-background-color rounded-3xl w-full pt-2 pb-2 pl-5 pr-5 focus:border-dark-accent-color focus:outline-none hover:border-dark-form-element-hover" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Passord" />
                        </div>

                        <div className="mt-3">
                            <button className="border-2 border-dark-form-border-color bg-dark-form-background-color text-dark-primary-color rounded-3xl pt-2 pb-2 pl-5 pr-5 focus:border-dark-form-focus-border-color focus:outline-none hover:border-dark-form-element-hover" type="submit">Logg inn </button>
                        </div>
                    </form>
                    <div className="mt-3">
                        {error && error.response.data && (<div className="text-accent-color">{error.response.data.error}</div>)}
                    </div>
                    <div className="mt-3">
                        Kontakt admin hvis du mangler konto
                        <br />
                        torbjorn.stensrud@structor.no
                    </div>
                    <div className="mt-3">
                        {
                            loading && loading === true && (
                                <LoadingSpinner />
                            )
                        }
                    </div>
                </div>
            </div>
        </div >
    );
}

export default Login