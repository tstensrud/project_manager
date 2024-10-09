import { useContext, useEffect, useRef, useState } from 'react';

import useSubmitData from "../../../hooks/useSubmitData";
import useFetch from '../../../hooks/useFetch.jsx';
import { AuthContext } from '../../../context/AuthContext.jsx';

// components
import CardInputField from "../../../layout/formelements/CardInputField";
import TextArea from "../../../layout/formelements/TextArea";
import CardButton from "../../../layout/formelements/CardButton";
import CustomSelect from './CustomSelect.jsx'

function NewMessage() {
    const { currentUser } = useContext(AuthContext);
    const { data, setData, error, loading, response, handleSubmit } = useSubmitData(`/user/new_message/`);
    const { data: userData, loading: userDataLoading, refetch: userDataRefetch } = useFetch(`/user/all_users/`);

    
    const messageRef = useRef(null);

    useEffect(() => {
        setData({ uuid: currentUser?.uid });
    }, []);

    useEffect(() => {
        if (response?.success) {
            messageRef.current.value = '';
        }
    },[response]);

    const handleFormChange = (e) => {
        setData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }))
    }

    const handleReceiverChange = (uuid) => {
        setData((prev) => ({
            ...prev,
            recipient_uuid: uuid,
        }))
    }

    const handleSubmitNewMessage = async (e) => {
        e.preventDefault();
        if (data) {
            await handleSubmit();
        }
    }

    return (
        <div className="flex flex-col w-full">
            <form>
                <div className="flex flex-row">
                    <CustomSelect handleReceiverChange={handleReceiverChange} selections={userData?.data} userDataLoading={userDataLoading} />
                    {/* <CardInputField ref={emailRef} name="email" changeFunction={handleFormChange} placeholder="Epost" required={true} /> */}
                    <div className="flex h-full items-center justify-center pl-3">
                        {
                            response && response.message
                        }
                    </div>
                </div>
                <div className="pt-2 pb-2 w-full">
                    <TextArea ref={messageRef} changeFunction={handleFormChange} name="message" required={true} />
                </div>
                <div>
                    <CardButton clickFunction={handleSubmitNewMessage} buttonText={"Send"} />
                </div>
            </form>
        </div>
    );
}

export default NewMessage;