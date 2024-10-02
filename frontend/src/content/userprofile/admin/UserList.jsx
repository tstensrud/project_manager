import { useEffect } from 'react'

// hooks
import useFetch from '../../../hooks/useFetch'
import useUpdateData from '../../../hooks/useUpdateData.jsx';
import LoadingSpinner from '../../../layout/LoadingSpinner.jsx';

function UserList({ newUserFlag }) {
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
        }
    }, [activeStatusResponse]);

    useEffect(() => {
        userDataRefetch();
    }, [newUserFlag])


    const handleActiveStatus = (e, uuid) => {
        e.preventDefault();
        setActiveStatus({ user_uid: uuid });
    }

    return (
        <>
            <div className="flex flex-col">
                <div className="flex flex-col w-full">
                    {
                        userDataLoading ? (
                            <LoadingSpinner text="brukere" />
                        ) : (
                            <table>
                                <thead>
                                    <tr className="border-default-border-color text-grey-text dark:text-dark-grey-text font-normal border-b dark:border-b-dark-default-border-color w-56">
                                        <th className="pt-1 pb-1 pl-3 min-w-[300px] max-w-[300px] w-[300px] text-start">
                                            Navn
                                        </th>
                                        <th className="pt-1 pb-1 min-w-[400px] max-w-[400px] w-[400px] text-start">
                                            Epost
                                        </th>
                                        <th className="pt-1 pb-1 pr-3 min-w-[100px] max-w-[100px] w-[100px] text-start">
                                            Sist innlogget
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
                                        <th className="pt-1 pb-1 pr-3 min-w-[100px] max-w-[100px] w-[100px] text-end">
                                            Slett
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {
                                        userData?.success === true && (
                                            Object.keys(userData.data).map((key, index) => (
                                                <tr key={index} className="hover:bg-table-hover dark:hover:bg-dark-table-hover">
                                                    <td className="pt-1 pb-1 pl-3 min-w-[300px] max-w-[300px] w-[300px] text-start">
                                                        {userData.data[key]["server"].name}
                                                    </td>
                                                    <td className="pt-1 pb-1 min-w-[400px] max-w-[400px] w-[400px]">
                                                        {userData.data[key]["server"].email}
                                                    </td>
                                                    <td className="pt-1 pb-1 pr-3 min-w-[100px] max-w-[100px] w-[100px]">
                                                        {
                                                            new Date(userData.data[key]["firebase"].last_sign_in_timestamp).toLocaleString('no-NO', {
                                                                year: 'numeric',
                                                                month: 'short',
                                                                day: 'numeric',
                                                            })
                                                        }
                                                    </td>
                                                    <td className="pt-1 pb-1 pr-3 min-w-[100px] max-w-[100px] w-[100px]">
                                                        {userData.data[key]["server"].admin ? 'Ja' : 'Nei'}
                                                    </td>
                                                    <td className="pt-1 pb-1 pr-3 min-w-[100px] max-w-[100px] w-[100px]">
                                                        {userData.data[key]["firebase"].disabled ? 'Nei' : 'Ja'}
                                                    </td>
                                                    <td className="pt-1 pb-1 pr-3 min-w-[150px] max-w-[150px] w-[150px] text-end">
                                                        <button onClick={(e) => handleActiveStatus(e, userData.data[key]["firebase"].uid)} className="text-accent-color dark:text-dark-accent-color hover:text-primary-color dark:hover:text-dark-primary-color">
                                                            {
                                                                userData.data[key]["firebase"].disabled ? 'Aktiver' : 'Deaktiver'
                                                            }
                                                        </button>
                                                    </td>
                                                    <td className="pt-1 pb-1 pr-3 min-w-[300px] max-w-[300px] w-[300px] text-end">
                                                        {userData.data[key]["firebase"].uid}
                                                    </td>
                                                    <td className="pt-1 pb-1 pr-3 min-w-[100px] max-w-[100px] w-[100px] text-end">
                                                        <button disabled>Slett</button>
                                                    </td>
                                                </tr>
                                            )
                                            )
                                        )
                                    }
                                </tbody>
                            </table>
                        )
                    }

                </div>
            </div>
        </>
    );
}

export default UserList;