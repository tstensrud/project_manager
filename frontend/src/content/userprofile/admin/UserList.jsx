import { useState, useEffect, useContext, useRef } from 'react'

// hooks
import useFetch from '../../../hooks/useFetch'
import useUpdateData from '../../../hooks/useUpdateData.jsx';

// components
import NewUser from './NewUser.jsx';
import AdminIcon from '../../../assets/svg/adminIcon.jsx';

function UserList() {
    const { data: userData, loading: userDataLoading, refetch: userDataRefetch } = useFetch(`/user/all_users/`);
    const { response: activeStatusResponse, data: activeStatusData, setData: setActiveStatus, handleSubmit: submitActiveStatus } = useUpdateData(`/user/change_user_status/`);


    useEffect(() => {
        if (activeStatusData) {
            submitActiveStatus();
        }
    }, [activeStatusData]);

    useEffect(() => {
        if (activeStatusResponse?.success === true) {
            userDataRefetch();
            //setDeactivateData({});
        }
    }, [activeStatusResponse]);


    const handleActiveStatus = (e, uuid) => {
        e.preventDefault();
        setActiveStatus({ user_uid: uuid });
    }

    return (
        <div className="bg-secondary-color dark:bg-dark-secondary-color rounded-lg ml-5 mr-5 mt-5 shadow-lg shadow-background-shade">
            <div className="flex flex-col p-4 h-full">
                <div className="flex flex-row mb-3">
                    <div>
                        <h2 className="text-grey-text dark:text-dark-grey-text">Brukere</h2>
                    </div>
                    <div className="flex flex-1 justify-end items-center">
                        <AdminIcon />
                    </div>
                </div>

                <div className="flex mb-3">
                    <NewUser userDataRefetch={userDataRefetch} />
                </div>

                <div className="flex flex-col">
                    <div className="flex flex-col w-full h-[600px] max-h-[600px]">
                        <table>
                            <thead>
                                <tr className="border-default-border-color text-grey-text dark:text-dark-grey-text  border-b dark:border-b-dark-default-border-color w-56">
                                    <th className="pt-1 pb-1 pl-3 min-w-[300px] max-w-[300px] w-[300px] text-start">
                                        Brukernavn
                                    </th>
                                    <th className="pt-1 pb-1 min-w-[400px] max-w-[400px] w-[400px] text-start">
                                        Epost
                                    </th>
                                    <th className="pt-1 pb-1 pr-3 min-w-[100px] max-w-[100px] w-[100px] text-start">
                                        Innlogget
                                    </th>
                                    <th className="pt-1 pb-1 pr-3 min-w-[100px] max-w-[100px] w-[100px] text-start">
                                        Admin
                                    </th>
                                    <th className="pt-1 pb-1 pr-3 min-w-[100px] max-w-[100px] w-[100px] text-start">
                                        Aktiv
                                    </th>
                                    <th className="pt-1 pb-1 pr-3 min-w-[150px] max-w-[150px] w-[150px] text-end">
                                        Deaktiver
                                    </th>
                                    <th className="pt-1 pb-1 pr-3 min-w-[300px] max-w-[300px] w-[300px] text-end">
                                        Bruker-ID
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {
                                    userData?.success === true && (
                                        Object.keys(userData.data).map((key, index) => (
                                            <tr key={index}>
                                                <td className="pt-1 pb-1 pl-3 min-w-[300px] max-w-[300px] w-[300px] text-start">
                                                    {userData.data[key].name}
                                                </td>
                                                <td className="pt-1 pb-1 min-w-[400px] max-w-[400px] w-[400px]">
                                                    {userData.data[key].email}
                                                </td>
                                                <td className="pt-1 pb-1 pr-3 min-w-[100px] max-w-[100px] w-[100px]">
                                                    {userData.data[key].logged_in ? 'Ja' : 'Nei'}
                                                </td>
                                                <td className="pt-1 pb-1 pr-3 min-w-[100px] max-w-[100px] w-[100px]">
                                                    {userData.data[key].admin ? 'Ja' : 'Nei'}
                                                </td>
                                                <td className="pt-1 pb-1 pr-3 min-w-[100px] max-w-[100px] w-[100px]">
                                                    {userData.data[key].is_active ? 'Ja' : 'Nei'}
                                                </td>
                                                <td className="pt-1 pb-1 pr-3 min-w-[150px] max-w-[150px] w-[150px] text-end">
                                                    <button onClick={(e) => handleActiveStatus(e, userData.data[key].uuid)} className="font-semibold hover:text-accent-accent-color dark:hover:text-dark-accent-color">
                                                        {
                                                            userData.data[key].is_active ? 'Deaktiver' : 'Aktiver'
                                                        }
                                                    </button>
                                                </td>
                                                <td className="pt-1 pb-1 pr-3 min-w-[300px] max-w-[300px] w-[300px] text-end">
                                                    {userData.data[key].uuid}
                                                </td>
                                            </tr>
                                        ))
                                    )
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserList;