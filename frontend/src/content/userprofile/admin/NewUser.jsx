import { useEffect, useRef } from 'react'

import useSubmitData from '../../../hooks/useSubmitData.jsx';

import CardInputField from '../../../layout/formelements/CardInputField.jsx';
import CardButton from '../../../layout/formelements/CardButton.jsx';

function NewUser({ userDataRefetch }) {
    const { setData: setNewUserData, response: newUserResponse, handleSubmit: submitNewUser } = useSubmitData(`/user/new_user/`);

    const emailRef = useRef(null);
    const nameRef = useRef(null);

    // useEffects
    useEffect(() => {
        if (newUserResponse?.success === true) {
            setNewUserData({});
            emailRef.current.value = '';
            nameRef.current.value = '';
            userDataRefetch();
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
                <div className="flex flex-row items-end">
                    <div className="flex flex-col mt-3 mr-3">
                        <div className="pl-2">
                            Epost til bruker
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
                    <div className="flex mt-3 h-full items-end justify-end">
                        <CardButton tabindex={3} buttonText="Legg til" />
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
                </div>
            </div>
        </form>
    );
}

export default NewUser