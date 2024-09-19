import { Link } from 'react-router-dom';
import { useState, useEffect, useContext, useRef } from 'react'

// Hooks and utils
import { GlobalContext } from '../../GlobalContext';
import useFetch from '../../hooks/useFetch'
import useDeleteData from '../../hooks/useDeleteData.jsx';
import useUpdateData from '../../hooks/useUpdateData.jsx';

// Components
import SubTitleComponent from '../../layout/SubTitleComponent';
import AccountIcon from '../../assets/svg/accountIcon.jsx'
import MainContentContainer from '../../layout/MainContentContainer.jsx';
import ContentCard from '../../layout/ContentCard.jsx';
import CardInputField from '../../layout/formelements/CardInputField.jsx';
import CardButton from '../../layout/formelements/CardButton.jsx';
import BookMarkIcon from '../../assets/svg/bookMarkIcon.jsx'
import EditIcon from '../../assets/svg/editIcon.jsx'
import InfoIcon from '../../assets/svg/infoIcon.jsx'
import ThumbsUp from '../../assets/svg/thumbsUp.jsx'
import LoadingSpinner from '../../layout/LoadingSpinner.jsx';
import UserList from './admin/UserList.jsx';

function UserProfile() {
    const { userUuid, setFavProjects } = useContext(GlobalContext);

    const { data, loading } = useFetch(`/user/`);
    const { data: favourites, loading: loadingFavs, refetch: refetchFavs } = useFetch(`/user/get_favs/`);

    const [deletedFavUid, setDeletedFavUid] = useState(null);
    const { response: deleteResponse, handleSubmit } = useDeleteData(`/user/remove_fav/${deletedFavUid}/`);

    const { response: passwordUpdateResponse, setData: setPasswordData, handleSubmit: submitNewPassword } = useUpdateData(`/user/change_password/`);

    // password-states
    const [passwordMatch, setPasswordMatch] = useState(false);
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPass, setConfirmPass] = useState("");

    useEffect(() => {
        if (deleteResponse?.success) {
            refetchFavs();
        }
    }, [deleteResponse]);

    useEffect(() => {
        if (deletedFavUid) {
            handleSubmit();
        }
    }, [deletedFavUid]);

    useEffect(() => {
        if (favourites?.success === true) {
            setFavouritesInGlobal(favourites.data)
        }
    }, [favourites]);

    useEffect(() => {
        if (newPassword && confirmPass) {
            if (newPassword === confirmPass) {
                setPasswordMatch(true)
            } else {
                setPasswordMatch(false);
            }
        }
    }, [newPassword, confirmPass]);

    useEffect(() => {
        if (passwordMatch) {
            setPasswordData({
                old: oldPassword,
                new: newPassword
            })
        } else {
            setPasswordData({})
        }
    }, [passwordMatch]);

    useEffect(() => {
        if (passwordUpdateResponse?.success === true) {
            setOldPassword('');
            setNewPassword('');
            setConfirmPass('');
            setPasswordData({});
            setPasswordMatch(false);
        }
    }, [passwordUpdateResponse]);

    // Handlers
    const handleDeleteClick = (e, favToDeleteUid) => {
        e.preventDefault();
        setDeletedFavUid(favToDeleteUid);
    }

    const setFavouritesInGlobal = (data) => {
        const updatedFavProjects = {};
        Object.keys(data).map((key) => (
            updatedFavProjects[data[key].project_name] = data[key].project_uid
        ));
        setFavProjects(updatedFavProjects);
    }

    const handleNewPasswordSubmit = async (e) => {
        e.preventDefault();
        if (passwordMatch) {
            await submitNewPassword();
        }
    }

    return (
        <>
            <SubTitleComponent svg={<AccountIcon />} headerText={`Velkommen tilbake, ${data?.data?.name}!`} projectName={""} projectNumber={""} />
            <MainContentContainer>
                <div className="flex flex-row justify-evenly flex-wrap w-full">

                    <ContentCard>
                        <div className="flex flex-row mb-3">
                            <div>
                                <h2 className="text-grey-text dark:text-dark-grey-text">Din brukerinformasjon</h2>
                            </div>
                            <div className="flex flex-1 justify-end items-center">
                                <InfoIcon />
                            </div>
                        </div>
                        {
                            loading ? (
                                <LoadingSpinner />
                            ) : (
                                <>
                                    {
                                        data?.success ? (
                                            <div className="flex flex-col">
                                                <div className="flex flex-row">
                                                    <div className="text-grey-text dark:text-dark-grey-text">Brukernavn: </div>
                                                    <div className="flex flex-1 justify-end">{data.data.name}</div>
                                                </div>
                                                <div className="flex flex-row">
                                                    <div className="text-grey-text dark:text-dark-grey-text">E-mail: </div>
                                                    <div className="flex flex-1 justify-end">{data.data.email}</div>
                                                </div>
                                                <div className="flex flex-row">
                                                    <div className="text-grey-text dark:text-dark-grey-text">Bruker-ID: </div>
                                                    <div className="flex flex-1 justify-end">{data.data.uuid}</div>
                                                </div>
                                                <div className="flex flex-row">
                                                    <div className="text-grey-text dark:text-dark-grey-text">Aktiv: </div>
                                                    <div className="flex flex-1 justify-end">{data.data.is_active && 'Ja'}</div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div>
                                                <h3>{data?.message}</h3>
                                            </div>
                                        )
                                    }
                                </>
                            )
                        }
                    </ContentCard>

                    <ContentCard>
                        <div className="flex flex-row mb-3">
                            <div>
                                <h2 className="text-grey-text dark:text-dark-grey-text">Dine prosjekter</h2>
                            </div>
                            <div className="flex flex-1 justify-end items-center">
                                <BookMarkIcon />
                            </div>
                        </div>
                        <div className="flex flex-col">
                            {
                                !favourites?.success ? (
                                    <div>
                                        {favourites?.message}
                                    </div>
                                ) : (
                                    <>
                                        {
                                            loadingFavs === true ? (
                                                <LoadingSpinner />
                                            ) : (
                                                <div className="flex flex-col">
                                                    <div className="flex flex-col w-full">
                                                        <div className="flex flex-row border-b border-default-border-color dark:border-dark-default-border-color">
                                                            <div className="flex w-[70%] text-grey-text dark:text-dark-grey-text">
                                                                Prosjektnavn
                                                            </div>
                                                            <div className="flex flex-1 justify-end text-grey-text dark:text-dark-grey-text">
                                                                Rediger favoritt
                                                            </div>
                                                        </div>
                                                        {
                                                            favourites?.success && (
                                                                Object.keys(favourites.data).map((key, index) => (
                                                                    <div className="flex flex-row">
                                                                        <div className="flex w-[70%]" key={index}>
                                                                            <Link className="text-primary-color dark:text-dark-primary-color hover:no-underline hover:text-accent-color hover:dark:text-dark-accent-color" to={`/project/${favourites.data[key].project_uid}/`}>
                                                                                {favourites.data[key].project_name}
                                                                            </Link>
                                                                        </div>
                                                                        <div className="flex flex-1 justify-end">
                                                                            <button className="hover:text-accent-color font-semibold hover:dark:text-dark-accent-color" onClick={(e) => handleDeleteClick(e, favourites.data[key].uid)}>Fjern</button>
                                                                        </div>
                                                                    </div>
                                                                ))
                                                            )
                                                        }
                                                    </div>
                                                </div>
                                            )
                                        }
                                    </>
                                )
                            }
                        </div>
                    </ContentCard>

                    <ContentCard>
                        <div className="flex flex-row mb-3">
                            <div>
                                <h2 className="text-grey-text dark:text-dark-grey-text mb-3">Bytt passord</h2>
                            </div>
                            <div className="flex flex-1 justify-end items-center">
                                <EditIcon dimension="20" />
                            </div>
                        </div>

                        <form onSubmit={handleNewPasswordSubmit}>
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
                            <div className="mt-2 flex flex-row">
                                <div className="flex flex-col mt-1">
                                    <div className="pl-2">
                                        Bekreft passord
                                    </div>
                                    <div>
                                        <CardInputField password={true} changeFunction={(e) => setConfirmPass(e.target.value)} value={confirmPass} required={true} placeholder="Bekreft nytt passord" />
                                    </div>
                                    <div className="flex items-center">
                                        {
                                            passwordMatch && <ThumbsUp />
                                        }
                                    </div>
                                </div>
                            </div>
                            <div className="mt-3">
                                <CardButton buttonText="Oppdater" />
                            </div>
                            {
                                passwordUpdateResponse?.success === false && (
                                    <div className="mt-3">
                                        Feil: {passwordUpdateResponse.message}
                                    </div>
                                )
                            }
                            {
                                passwordUpdateResponse?.success === true && (
                                    <div className="mt-3">
                                        {passwordUpdateResponse.message}
                                    </div>
                                )
                            }

                        </form>
                    </ContentCard>
                </div>

                {
                    data?.success === true && (
                        data?.admin && (
                            <div className="flex flex-row justify-evenly flex-wrap w-full">
                                <UserList uuid={userUuid} />
                            </div>
                        )
                    )
                }
            </MainContentContainer>
        </>
    );
}

export default UserProfile;