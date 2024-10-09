import { useContext, useEffect, useState } from 'react';

// hooks and utils
import useDeleteData from '../../../hooks/useDeleteData.jsx';
import useSubmitData from '../../../hooks/useSubmitData.jsx';
import useUpdateData from '../../../hooks/useUpdateData.jsx';

// components
import CardButton from '../../../layout/formelements/CardButton';

function Message({ data, newMessage, messageRefetch }) {

    const { data: deleteData, setData: setDeleteData, loading: deleteLoading, response: deleteResponse, error: deleteError, handleSubmit: deleteSubmit } = useDeleteData(`/user/delete_msg/`);
    const { data: readData, setData: setReadData, loading: readLoading, error: readError, handleSubmit: readSubmit, response: readResponse } = useUpdateData(`/user/markasread/`);


    useEffect(() => {
        const deleteMessage = async () => {
            if (deleteData) {
                await deleteSubmit();
            }
        }
        deleteMessage();
    }, [deleteData]);

    useEffect(() => {
        const markAsRead = async () => {
            if (readData) {
                await readSubmit();
            }
        }
        markAsRead();
    },[readData])

    useEffect(() => {
        if (deleteResponse?.success) {
            messageRefetch();
        }
    }, [deleteResponse]);

    useEffect(() => {
        if (readResponse?.success) {
            messageRefetch();
        }
    }, [readResponse])

    // Handlers
    const handleDeleteClick = async (e) => {
        e.preventDefault();
        setDeleteData({ msgUid: data.messageData.uid });
    }

    const handleMarkAsReadClick = (e) => {
        e.preventDefault();
        setReadData({msgUid: data.messageData.uid, read: true});
    }


    return (
        <div className="mt-3 mb-3 flex flex-col text-sm border rounded-lg border-default-border-color dark:border-dark-default-border-color">
            <div className="flex flex-row border-b border-default-border-color dark:border-dark-default-border-color">
                <div className={`${newMessage && "text-grey-text dark:text-dark-grey-text"} flex flex-row p-3`}>
                    Fra: {data?.userData?.name}
                </div>
                <div className="flex flex-row flex-1 p-3 text-grey-text dark:text-dark-grey-text text-end justify-end">
                    {data?.messageData?.timestamp}
                </div>
            </div>
            <div className={`${!newMessage && "text-grey-text dark:text-dark-grey-text"} flex flex-row p-3 whitespace-pre-wrap`}>
                {data?.messageData?.message}
            </div>

            <div className="flex flex-row p-3 items-center">
                <div className="pr-3">
                    <CardButton buttonText="Åpne tråd" clickFunction={``} />
                </div>
                {
                    newMessage && (
                        <div className="pr-3">
                            <CardButton loading={readLoading} buttonText="Merk lest" clickFunction={handleMarkAsReadClick} />
                        </div>
                    )
                }
                <div className="pr-3">
                    <CardButton loading={deleteLoading} buttonText="Slett" clickFunction={handleDeleteClick} />
                </div>
                <div className="flex items-center h-full justify-center">
                        {deleteResponse?.success === false && deleteResponse.message}
                        {readResponse?.success === false && readResponse.message}
                </div>
            </div>
        </div>
    );
}

export default Message