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
        <ContentCard>
            <div className="flex flex-row mb-3">
                <div>
                    <h2 className="text-grey-text dark:text-dark-grey-text mb-3">Bytt passord</h2>
                </div>
                <div className="flex flex-1 justify-end items-center">
                    <div className="w-fit dark:bg-dark-accent-color bg-accent-color p-1 border border-accent-color dark:border-dark-accent-color rounded-lg">
                        <EditIcon width={20} height={20} primary={true} />
                    </div>
                </div>
            </div>

            <form onSubmit={handleUpdatePassword}>
                <div className="flex flex-col mt-1">
                    <div className="pl-2">
                        Gammelt passord
                    </div>
                    <div>
                        <CardInputField password={true} changeFunction={(e) => setOldPassword(e.target.value)} value={oldPassword} required={true} placeholder="Skriv inn gammelt passord" />
                    </div>
                </div>

                <div className="mt-2 flex flex-row">
                    <div className="flex flex-col mt-1">
                        <div className="pl-2">
                            Nytt passord
                        </div>
                        <div>
                            <CardInputField password={true} changeFunction={(e) => setNewPassword(e.target.value)} value={newPassword} required={true} placeholder="Skriv inn nytt passord" />
                        </div>
                    </div>
                </div>
                <div className="mt-2 flex flex-row items-center">
                    <div className="flex flex-col mt-1">
                        <div className="pl-2">
                            Bekreft passord
                        </div>
                        <div className="flex items-center flex-row">
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