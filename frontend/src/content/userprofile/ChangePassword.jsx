import { useState, useEffect, useContext, useRef } from 'react'
import { reauthenticateWithCredential, updatePassword, EmailAuthProvider } from 'firebase/auth';

// Hooks and utils
import { AuthContext } from '../../context/AuthContext.jsx';

// components
import ThumbsUp from '../../assets/svg/thumbsUp.jsx'
import ContentCard from '../../layout/ContentCard.jsx';
import CardInputField from '../../layout/formelements/CardInputField.jsx';
import CardButton from '../../layout/formelements/CardButton.jsx';
import EditIcon from '../../assets/svg/editIcon.jsx'

function ChangePassword() {

    const { currentUser, idToken, dispatch, loading: authLoading } = useContext(AuthContext);

    const [passwordChangeErrorMsg, setPasswordChangeErrorMsg] = useState("");

    // password-states
    const [passwordMatch, setPasswordMatch] = useState(false);
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPass, setConfirmPass] = useState("");

    useEffect(() => {
        if (newPassword && confirmPass) {
            if (newPassword === confirmPass) {
                setPasswordMatch(true)
            } else {
                setPasswordMatch(false);
            }
        }
    }, [newPassword, confirmPass]);

    const handleUpdatePassword = (e) => {
        e.preventDefault();

        if (newPassword.length < 6) {
            setPasswordChangeErrorMsg("Passordet er for kort. Minst 6 tegn");
            return;
        }

        if (passwordMatch) {
            const credentials = EmailAuthProvider.credential(currentUser.email, oldPassword)

            reauthenticateWithCredential(currentUser, credentials).then(() => {
                updatePassword(currentUser, newPassword).then(() => {

                }).catch((error) => {
                    setPasswordChangeErrorMsg("Kunne ikke oppdatere passord")
                });
            })
                .catch((error) => {
                    if (error.message === "Firebase: Error (auth/invalid-credential).") {
                        setPasswordChangeErrorMsg("Gammelt passord er feil")
                    }
                })
        }
    }

    return (
        <ContentCard width="32">
            <div className="flex flex-row">
                <div>
                    <h2 className="text-grey-text dark:text-dark-grey-text">Bytt passord</h2>
                </div>
                <div className="flex flex-1 justify-end items-center">
                    <div className="w-fit dark:bg-dark-accent-color bg-accent-color p-1 border border-accent-color dark:border-dark-accent-color rounded-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className="stroke-secondary-color stroke-2 dark:stroke-dark-primary-color fill-none">
                            <polygon points="14 2 18 6 7 17 3 17 3 13 14 2"></polygon>
                            <line x1="3" y1="22" x2="21" y2="22"></line>
                        </svg>
                    </div>
                </div>
            </div>

            <form onSubmit={handleUpdatePassword}>

                <div className="mt-2 flex">
                    <div className="flex flex-col mt-1">
                        <div className="pl-1">
                            Gammelt passord
                        </div>
                        <div>
                            <CardInputField password={true} changeFunction={(e) => setOldPassword(e.target.value)} value={oldPassword} required={true} placeholder="Skriv inn gammelt passord" />
                        </div>
                    </div>
                </div>

                <div className="mt-2 flex">
                    <div className="flex flex-col mt-1">
                        <div className="pl-1">
                            Nytt passord
                        </div>
                        <div>
                            <CardInputField password={true} changeFunction={(e) => setNewPassword(e.target.value)} value={newPassword} required={true} placeholder="Skriv inn nytt passord" />
                        </div>
                    </div>
                </div>

                <div className="mt-2 flex items-center">
                    <div className="flex flex-col mt-1">
                        <div className="pl-1">
                            Bekreft nytt passord
                        </div>
                        <div className="flex items-center">
                            <div className="mr-10">
                                <CardInputField password={true} changeFunction={(e) => setConfirmPass(e.target.value)} value={confirmPass} required={true} placeholder="Bekreft nytt passord" />
                            </div>
                            <div className="flex items-end h-full">
                                {
                                    passwordMatch && <ThumbsUp />
                                }
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-3">
                    <CardButton buttonText="Oppdater" />
                </div>
                {
                    passwordChangeErrorMsg !== "" && (
                        <div className="mt-3">
                            Feil: {passwordChangeErrorMsg}
                        </div>
                    )
                }

            </form>
        </ContentCard>
    );
}

export default ChangePassword;