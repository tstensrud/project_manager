import { useEffect, useRef } from 'react'

// hooks and utils
import useSubmitData from '../../../hooks/useSubmitData.jsx';

// components
import CardInputField from '../../../layout/formelements/CardInputField.jsx';
import CardButton from '../../../layout/formelements/CardButton.jsx';

function NewUser({ newUserFlag, setNewUserFlag }) {
    const { data: newUserData, setData: setNewUserData, response: newUserResponse, handleSubmit: submitNewUser } = useSubmitData(`/user/new_user/`);

    const emailRef = useRef(null);
    const nameRef = useRef(null);

    // useEffects
    useEffect(() => {
        if (newUserResponse?.success === true) {
            setNewUserData({});
            emailRef.current.value = '';
            nameRef.current.value = '';
            setNewUserFlag(!newUserFlag);
        }
    }, [newUserResponse]);

    // handlers
    const handleInputChange = (e) => {
        setNewUserData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }))
    }

    const handleSubmit = (e) => {
        e.preventDefault(e);
        submitNewUser();
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="flex flex-col">
                <div className="flex flex-col">
                    <div className="flex flex-col mt-3 mr-3">
                        <div className="pl-2">
                            E-postadresse
                        </div>
                        <div>
                            <CardInputField ref={emailRef} tabindex={1} name="email" changeFunction={handleInputChange} required={true} placeholder="E-post" />
                        </div>
                    </div>
                    <div className="flex flex-col mt-3 mr-3">
                        <div className="pl-2">
                            Brukernavn
                        </div>
                        <div>
                            <CardInputField ref={nameRef} tabindex={2} name="name" changeFunction={handleInputChange} required={true} placeholder="Navn" />
                        </div>
                    </div>
                    <div className="flex mt-3 h-full">
                        <CardButton tabindex={3} buttonText="Legg til ny bruker" />
                    </div>

                </div>
                <div className="ml-3 flex flex-1 items-center h-full">
                    {
                        newUserResponse?.success === false && (
                            <div className="flex h-full items-center mt-3 text-accent-color dark:text-dark-accent-color">
                                Feil: {newUserResponse.message}
                            </div>
                        )
                    }
                    {
                        newUserResponse?.success === true && (
                            <div className="flex h-full items-center mt-3">
                               Ny bruker opprettet: <div className="ml-5 text-accent-color dark:text-dark-accent-color">https://tstensrud.github.io/project_manager/#/register/{newUserResponse.data}</div>
                            </div>
                        )
                    }
                </div>
            </div>
        </form>
    );
}

export default NewUser