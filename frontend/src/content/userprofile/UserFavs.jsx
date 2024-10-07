import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';

// hooks and utils
import useDeleteData from '../../hooks/useDeleteData.jsx';

// components
import ContentCard from "../../layout/ContentCard";
import BookMarkIcon from '../../assets/svg/bookMarkIcon.jsx'

function UserFavs({ userData, fetchData }) {

    const [deletedFavUid, setDeletedFavUid] = useState(null);
    const { response: deleteResponse, handleSubmit } = useDeleteData(`/user/remove_fav/${deletedFavUid}/`);

    useEffect(() => {
        if (deleteResponse?.success) {
            fetchData();
        }
    }, [deleteResponse]);

    useEffect(() => {
        if (deletedFavUid) {
            handleSubmit();
        }
    }, [deletedFavUid]);

    // Handlers
    const handleDeleteClick = (e, favToDeleteUid) => {
        e.preventDefault();
        setDeletedFavUid(favToDeleteUid);
    }

    return (
        <ContentCard>
            <div className="flex flex-row mb-3 w-[450px]">
                <div>
                    <h2 className="text-grey-text dark:text-dark-grey-text">Dine prosjekter</h2>
                </div>
                <div className="flex flex-1 justify-end items-center">
                    <div className="w-fit dark:bg-dark-accent-color bg-accent-color p-1 border border-accent-color dark:border-dark-accent-color rounded-lg">
                        <BookMarkIcon width={20} height={20} primary={true} />
                    </div>
                </div>
            </div>
            <div className="flex flex-col">
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
                            userData && Object.keys(userData).map((key, index) => (
                                <div key={index} className="flex flex-row pt-1 pb-1">
                                    <div className="flex w-[70%]" key={index}>
                                        <Link className="text-primary-color dark:text-dark-primary-color hover:no-underline hover:text-accent-color hover:dark:text-dark-accent-color" to={`/project/${userData[key].project_uid}/`}>
                                            {userData[key].project_name}
                                        </Link>
                                    </div>
                                    <div className="flex flex-1 justify-end">
                                        <button className="border border-accent-color dark:border-dark-accent-color pl-2 pr-2 rounded-lg text-primary-color dark:text-dark-primary-color hover:text-secondary-color hover:bg-accent-color hover:dark:bg-dark-navbar-hover-bg-color duration-300" onClick={(e) => handleDeleteClick(e, userData[key].uid)}>Fjern</button>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
        </ContentCard>
    );
}

export default UserFavs;