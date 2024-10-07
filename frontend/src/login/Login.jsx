import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";

import { AuthContext } from '../context/AuthContext.jsx';

import LoadingSpinner from '../layout/LoadingSpinner.jsx';

function Login(props) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const { dispatch } = useContext(AuthContext);
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const [passwordInputType, setPasswordInputType] = useState("password")

    const firebaseLogin = async (e) => {
        e.preventDefault();
        const auth = getAuth();
        setLoading(true);
        await signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                dispatch({ type: "LOGIN", payload: user })
                navigate("/");
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                setError(true);
                setErrorMessage(errorMessage);
                setLoading(false);
            });
    }

    const handleForgotPassword = (e) => {
        e.preventDefault();
        const auth = getAuth();
        sendPasswordResetEmail(auth, email)
            .then(() => {
                setErrorMessage(`Følg instruksjoner sendt til ${email}`);
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                setErrorMessage(errorMessage);
            })
    }

    const handlePasswordVisibleClick = (e) => {
        e.preventDefault();
        if (passwordInputType === "password") {
            setPasswordInputType("text");
        } else {
            setPasswordInputType("password");
        }
    }
    return (
        <div className="flex w-full h-full overflow-auto text-dark-primary-color justify-center text-center items-center bg-gradient-to-tr from-dark-tertiary-color to-dark-secondary-color">
            <div className="h-full flex items-start xl:items-center sm:items-center">
                <div className="flex flex-col overflow-hidden justify-center bg-dark-secondary-color border border-dark-accent-color rounded-lg shadow-lg shadow-background-shade h-[450px]">
                    <div className="w-full flex justify-end pr-5 pl-5 pt-2">
                        <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" className="stroke-dark-accent-color dark:stroke-dark-accent-color fill-none hover:fill-dark-accent-color" viewBox="0 0 24 24">
                            <path strokeWidth="2" d="M11.083 5.104c.35-.8 1.485-.8 1.834 0l1.752 4.022a1 1 0 0 0 .84.597l4.463.342c.9.069 1.255 1.2.556 1.771l-3.33 2.723a1 1 0 0 0-.337 1.016l1.03 4.119c.214.858-.71 1.552-1.474 1.106l-3.913-2.281a1 1 0 0 0-1.008 0L7.583 20.8c-.764.446-1.688-.248-1.474-1.106l1.03-4.119A1 1 0 0 0 6.8 14.56l-3.33-2.723c-.698-.571-.342-1.702.557-1.771l4.462-.342a1 1 0 0 0 .84-.597l1.753-4.022Z" />
                        </svg>
                    </div>
                    <div className="flex flex-col items-center justify-start pl-20 pr-20 h-full pt-10">
                        <form>
                            <div>
                                <div className="text-2xl">
                                    Structor TS prosjekter
                                </div>
                                <div className="flex mt-5">
                                    <input className="border border-dark-default-border-color bg-dark-secondary-color rounded-lg w-full pt-2 pb-2 pl-5 pr-5 focus:border-dark-accent-color focus:outline-none hover:border-dark-accent-color" type="text" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="E-post" />
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" stroke-width="2" strokeLinecap="round" strokeLinejoin="round" className="stroke-grey-text fill-none relative right-8 top-3">
                                        <circle cx="12" cy="12" r="4"></circle>
                                        <path d="M16 12v1a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.92 7.94"></path>
                                    </svg>
                                </div>
                                <div className="mt-3 flex">
                                    <input className="border border-dark-default-border-color bg-dark-secondary-color rounded-lg w-full pt-2 pb-2 pl-5 pr-5 focus:border-dark-accent-color focus:outline-none hover:border-dark-accent-color" type={passwordInputType} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Passord" />
                                    {
                                        passwordInputType === "password" ? (
                                            <svg onClick={handlePasswordVisibleClick} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="stroke-grey-text fill-none relative right-8 top-3 cursor-pointer hover:stroke-dark-primary-color">
                                                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                                                <line x1="1" y1="1" x2="23" y2="23"></line>
                                            </svg>
                                        ) : (
                                            <svg onClick={handlePasswordVisibleClick} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="stroke-grey-text fill-none relative right-8 top-3 cursor-pointer hover:stroke-dark-primary-color">
                                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                                <circle cx="12" cy="12" r="3"></circle>
                                            </svg>
                                        )
                                    }



                                </div>

                                <div className="flex flex-col mt-3 justify-center">
                                    <div className="mb-5">
                                        <button onClick={firebaseLogin} className="border border-dark-default-border-color bg-dark-secondary-color text-dark-primary-color rounded-lg pt-2 pb-2 pl-5 pr-5 focus:border-dark-accent-color focus:outline-none hover:border-dark-accent-color" type="submit">
                                            Logg inn
                                        </button>
                                    </div>
                                    <div className="h-10">
                                        {
                                            loading && (
                                                <LoadingSpinner />
                                            )
                                        }
                                    </div>
                                </div>
                            </div>
                        </form>
                        <div className="mt-3">
                            {error &&
                                <div>
                                    <div>
                                        {errorMessage}
                                    </div>
                                    <div>
                                        <button onClick={handleForgotPassword} className="hover:text-accent-color hover:dark:text-dark-accent-color">Glemt passord?</button>
                                    </div>
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
}

export default Login