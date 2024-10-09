import { useContext, useState } from 'react';

// hooks and utils
import { AuthContext } from '../../../context/AuthContext.jsx';
import useFetch from '../../../hooks/useFetch.jsx';

// components
import LoadingSpinner from '../../../layout/LoadingSpinner.jsx';
import Message from './Message.jsx';

function Archive() {
    const { currentUser, loading: authLoading } = useContext(AuthContext);
    const { data: messageData, loading: messageLoading, error: messageError, refetch: messageRefetch } = useFetch(currentUser ? `/user/archive/${currentUser.uid}/` : null);

    return (
        <div className="flex flex-col">
            {
                messageLoading ? (
                    <LoadingSpinner text="arkiv" />
                ) : (
                    <>
                        {
                            messageData?.success ? (
                                <>
                                    {
                                        messageData?.data && Object.keys(messageData?.data).map((key, index) => (
                                            <Message messageRefetch={messageRefetch} newMessage={false} key={index} data={messageData.data[key]} />
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

export default Archive;