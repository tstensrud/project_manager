import { useEffect } from 'react'

// hooks
import useFetch from '../../../hooks/useFetch'
import useUpdateData from '../../../hooks/useUpdateData.jsx';

// components
import SearchInput from '../../../layout/formelements/SearchInput.jsx';

function UserList({newUserFlag}) {
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
    },[newUserFlag])


    const handleActiveStatus = (e, uuid) => {
        e.preventDefault();
        setActiveStatus({ user_uid: uuid });
    }

    return (
        <>
            <div className="flex flex-col">
                <div className="flex flex-col w-full">
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
                                                {userData.data[key].name}
                                            </td>
                                            <td className="pt-1 pb-1 min-w-[400px] max-w-[400px] w-[400px]">
                                                {userData.data[key].email}
                                            </td>
                                            <td className="pt-1 pb-1 pr-3 min-w-[100px] max-w-[100px] w-[100px]">
                                                {userData.data[key].loggedIn ? 'Ja' : 'Nei'}
                                            </td>
                                            <td className="pt-1 pb-1 pr-3 min-w-[100px] max-w-[100px] w-[100px]">
                                                {userData.data[key].admin ? 'Ja' : 'Nei'}
                                            </td>
                                            <td className="pt-1 pb-1 pr-3 min-w-[100px] max-w-[100px] w-[100px]">
                                                {userData.data[key].isActive ? 'Ja' : 'Nei'}
                                            </td>
                                            <td className="pt-1 pb-1 pr-3 min-w-[150px] max-w-[150px] w-[150px] text-end">
                                                <button onClick={(e) => handleActiveStatus(e, userData.data[key].uuid)} className="font-semibold hover:text-accent-accent-color dark:hover:text-dark-accent-color">
                                                    {
                                                        userData.data[key].isActive ? 'Deaktiver' : 'Aktiver'
                                                    }
                                                </button>
                                            </td>
                                            <td className="pt-1 pb-1 pr-3 min-w-[300px] max-w-[300px] w-[300px] text-end">
                                                <a href={`https://tstensrud.github.io/project_manager/#/register/${userData.data[key].uuid}`} target="_blank">{userData.data[key].uuid}</a>
                                            </td>
                                            <td className="pt-1 pb-1 pr-3 min-w-[100px] max-w-[100px] w-[100px] text-end">
                                                <button disabled>Slett</button>
                                            </td>
                                        </tr>
                                    ))
                                )
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}

export default UserList;