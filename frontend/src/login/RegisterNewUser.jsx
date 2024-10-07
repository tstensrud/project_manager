import { useState, useContext, useEffect } from "react";
import { useNavigate, useParams, useSubmit } from "react-router-dom";

// hooks and utils
import useFetch from "../hooks/useFetch.jsx";
import useUpdateData from "../hooks/useUpdateData.jsx";

// components
import LoadingSpinner from '../layout/LoadingSpinner.jsx';
import ThumbsUp from '../assets/svg/thumbsUp.jsx'

function RegisterNewUser() {
    const { uuid } = useParams();
    const navigate = useNavigate();

    const { data, loading } = useFetch(`/user/new_user_registration/${uuid}/`);
    const { data: passwordData, setData: setPasswordData, response: submitResponse, handleSubmit: submitNewPassword } = useUpdateData(`/user/set_password/${uuid}/`);
    
    const [passwordMatch, setPasswordMatch] = useState(false);
    const [newPassword, setNewPassword] = useState("");
    const [confirmPass, setConfirmPass] = useState("");

    // useEffects
    useEffect(() => {
        if (newPassword && confirmPass) {
            if (newPassword === confirmPass) {
                setPasswordMatch(true)
            } else {
                setPasswordMatch(false);
            }
        }
    }, [newPassword, confirmPass]);

    useEffect(() => {
        if (passwordMatch) {
            setPasswordData({
                password: newPassword,
            })
        } else {
            setPasswordData({})
        }
    }, [passwordMatch]);

    useEffect(() => {
        if(submitResponse?.success === true) {
            navigate('/');
        }
    },[submitResponse])

    // handlers
    const handleNewPasswordSubmit = async (e) => {
        e.preventDefault();
        if (passwordMatch) {
            await submitNewPassword();
        }
    }

    return (
        <div className="flex w-full h-full text-dark-primary-color justify-center text-center items-center bg-gradient-to-tr from-dark-tertiary-color to-dark-secondary-color">
            <div className="flex flex-col overflow-auto justify-center bg-dark-secondary-color border border-dark-accent-color rounded-lg shadow-lg shadow-background-shade h-[40%]">
                {
                    data?.success === true ? (
                        <>
                            <div className="w-full flex justify-end pr-5 pl-5 pt-2">
                                <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" className="stroke-dark-accent-color dark:stroke-dark-accent-color fill-none hover:fill-dark-accent-color" viewBox="0 0 24 24">
                                    <path strokeWidth="2" d="M11.083 5.104c.35-.8 1.485-.8 1.834 0l1.752 4.022a1 1 0 0 0 .84.597l4.463.342c.9.069 1.255 1.2.556 1.771l-3.33 2.723a1 1 0 0 0-.337 1.016l1.03 4.119c.214.858-.71 1.552-1.474 1.106l-3.913-2.281a1 1 0 0 0-1.008 0L7.583 20.8c-.764.446-1.688-.248-1.474-1.106l1.03-4.119A1 1 0 0 0 6.8 14.56l-3.33-2.723c-.698-.571-.342-1.702.557-1.771l4.462-.342a1 1 0 0 0 .84-.597l1.753-4.022Z" />
                                </svg>
                            </div>

                            <div className="flex flex-col items-center justify-start pl-20 pr-20 h-full pt-10">
                                <form onSubmit={handleNewPasswordSubmit}>

                                    <div className="text-2xl">
                                        Structor TS prosjekter
                                    </div>
                                    <div className="mt-5">
                                        Fullfør registreringen ved angi et passord
                                    </div>

                                    <div className="mt-5 flex flex-row w-full items-center">
                                        <input type="password" className="border border-dark-default-border-color bg-dark-secondary-color rounded-lg w-full pt-2 pb-2 pl-5 pr-5 focus:border-dark-accent-color focus:outline-none hover:border-dark-accent-color" value={newPassword} onChange={(e) => (setNewPassword(e.target.value))} placeholder="Nytt passord" />
                                    </div>

                                    <div className="mt-2 flex flex-col items-center w-full">
                                            <div className="flex items-center flex-row w-full">
                                                <input className="border border-dark-default-border-color bg-dark-secondary-color rounded-lg w-full pt-2 pb-2 pl-5 pr-5 focus:border-dark-accent-color focus:outline-none hover:border-dark-accent-color" type="password" value={confirmPass} onChange={(e) => (setConfirmPass(e.target.value))} placeholder="Gjenta passord" />
                                            </div>
                                            <div className="flex justify-center w-full h-20 items-center">
                                                {
                                                    passwordMatch && <ThumbsUp />
                                                }
                                            </div>
                                    </div>

                                    <div className="flex flex-col mt-3 justify-center">
                                        <div className="mb-5">
                                            <button className="border border-dark-default-border-color bg-dark-secondary-color text-dark-primary-color rounded-lg pt-2 pb-2 pl-5 pr-5 focus:border-dark-accent-color focus:outline-none hover:border-dark-accent-color" type="submit" disabled={!passwordMatch}>
                                                Fortsett
                                            </button>
                                        </div>
                                        <div className="h-10">
                                        </div>
                                    </div>
                                </form>
                                <div className="mt-3">
                                    {(<div className="text-accent-color dark:text-dark-accent-color">{``}</div>)}
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="pr-20 pl-20">
                            {data?.success === false && data.message}
                        </div>
                    )
                }

            </div>
        </div >
    );
}

export default RegisterNewUser;