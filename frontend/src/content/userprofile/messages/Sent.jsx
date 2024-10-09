import { useContext, useState } from 'react';

// hooks and utils
import { AuthContext } from '../../../context/AuthContext.jsx';
import useDeleteData from '../../../hooks/useDeleteData.jsx';
import useFetchRequest from '../../../hooks/useFetchRequest.jsx';
import useFetch from '../../../hooks/useFetch.jsx';

// components
import LoadingSpinner from '../../../layout/LoadingSpinner.jsx';
import Message from './Message.jsx';

function Sent() {
    const { currentUser, loading: authLoading } = useContext(AuthContext);
    const { data: messageData, loading: messageLoading, error: messageError, refetch: messageRefetch } = useFetch(currentUser ? `/user/sent/${currentUser.uid}/` : null)

    return (
        <div className="flex flex-col">
            {
                messageLoading ? (
                    <LoadingSpinner text="sendte meldinger" />
                ) : (
                    <>
                        {
                            messageData?.success ? (
                                <>
                                    {
                                        messageData?.data && Object.keys(messageData?.data).map((key, index) => (
                                            <Message messageRefetch={messageRefetch} newMessage={true} key={index} data={messageData.data[key]} />
                                        ))
                                    }
                                </>
                            ) : (
                                <>
                                    {messageData?.message}
                                </>
                            )
                        }
                    </>
                )
            }
        </div>
    );
}

export default Sent;