import { Link } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react'

// Hooks and utils
import { GlobalContext } from '../../GlobalContext';
import useFetch from '../../hooks/useFetch'
import useDeleteData from '../../hooks/useDeleteData.jsx';

// Components
import SubTitleComponent from '../../layout/SubTitleComponent';
import AccountIcon from '../../assets/svg/accountIcon.jsx'
import MainContentContainer from '../../layout/MainContentContainer.jsx';
import ContentCard from '../../layout/ContentCard.jsx';
import CardInputField from '../../layout/formelements/CardInputField.jsx';
import CardButton from '../../layout/formelements/CardButton.jsx';


function UserProfile() {
    const { userUuid, } = useContext(GlobalContext);
    
    const { data, loading } = useFetch(`/user/${userUuid}/`);
    const { data: favourites, loading: loadingFavs, refetch: refetchFavs } = useFetch(`/user/${userUuid}/get_favs/`)

    const [ deletedFavUid, setDeletedFavUid] = useState(null);
    const { data: deleteData, setData: setDeleteData, response: deleteResponse, handleSubmit} = useDeleteData(`/user/${userUuid}/remove_fav/${deletedFavUid}/`);

    useEffect(() => {
        if (deleteResponse?.success) {
            refetchFavs();
        }
    },[deleteResponse]);
    
    useEffect(() => {
        if (deletedFavUid) {
            handleSubmit();
        }
    },[deletedFavUid]);

    // Handlers
    const handleDeleteClick = (e, favToDeleteUid) => {
        e.preventDefault();
        setDeletedFavUid(favToDeleteUid);
    }

    console.log(deleteResponse)
    return (
        <>
            <SubTitleComponent svg={<AccountIcon />} headerText={`Velkommen tilbake, ${data?.data?.name}!`} projectName={""} projectNumber={""} />
            <MainContentContainer>
                <div className="flex justify-evenly flex-wrap w-full">
                    <ContentCard>
                        <div>
                            <h2 className="text-grey-text dark:text-dark-grey-text">Din brukerinformasjon</h2>
                        </div>
                        {
                            data?.success ? (
                                <div className="flex flex-col">
                                    <div className="flex flex-row">
                                        <div className="mr-5">Brukernavn: </div>
                                        <div className="flex flex-1 justify-end">{data.data.name}</div>
                                    </div>
                                    <div className="flex flex-row">
                                        <div>E-mail: </div>
                                        <div className="flex flex-1 justify-end">{data.data.email}</div>
                                    </div>
                                    <div className="flex flex-row">
                                        <div>Bruker-ID: </div>
                                        <div className="flex flex-1 justify-end">{data.data.uuid}</div>
                                    </div>
                                    <div className="flex flex-row">
                                        <div>Aktiv: </div>
                                        <div className="flex flex-1 justify-end">{data.data.is_active && 'Ja'}</div>
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <h3>{data?.message}</h3>
                                </div>
                            )
                        }
                    </ContentCard>
                    <ContentCard>
                        <div>
                            <h2 className="text-grey-text dark:text-dark-grey-text">Dine prosjekter</h2>
                        </div>
                        <div className="flex flex-col">
                            {
                                !favourites?.success ? (
                                    <div>
                                        {favourites?.message}
                                    </div>
                                ) : (
                                    <>
                                        <div className="flex flex-col">
                                            {
                                                favourites?.success && (
                                                    Object.keys(favourites.data).map((key, index) => (
                                                        <div className="flex flex-row">
                                                            <div key={index}>
                                                                <Link to={`/project/${favourites.data[key].project_uid}/`}>
                                                                    {favourites.data[key].project_name}
                                                                </Link>
                                                            </div>
                                                            <div className="flex flex-1 justify-end">
                                                                <button className="text-accent-color dark:text-dark-accent-color" onClick={(e) => handleDeleteClick(e, favourites.data[key].uid)}>Fjern</button>
                                                            </div>
                                                        </div>
                                                    ))
                                                )
                                            }
                                        </div>
                                    </>
                                )
                            }
                        </div>
                    </ContentCard>
                    <ContentCard>
                        <div>
                            <h2 className="text-grey-text dark:text-dark-grey-text">Bytt passord</h2>
                        </div>
                        <form>
                            <div className="mt-3">
                                <CardInputField placeholder="Skriv inn gammelt passord" />
                            </div>
                            <div className="mt-2">
                                <CardInputField placeholder="Skriv inn nytt passord" />
                            </div>
                            <div className="mt-2">
                                <CardInputField placeholder="Bekreft nytt passord" />
                            </div>
                            <div className="mt-3">
                                <CardButton buttonText="Oppdater" />
                            </div>
                        </form>
                    </ContentCard>
                </div>
            </MainContentContainer>
        </>
    );
}

export default UserProfile;