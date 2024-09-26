import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

// Hooks and utils
import useFetch from '../../hooks/useFetch'
import { GlobalContext } from '../../GlobalContext';

// Components
import StarIcon from '../../assets/svg/starIcon.jsx';
import CardTitle from '../../layout/CardTitle';
import LoadingSpinner from '../../layout/LoadingSpinner';
import ContentCard from '../../layout/ContentCard';
import useSubmitData from '../../hooks/useSubmitData.jsx';
import BookMarkIcon from '../../assets/svg/bookMarkIcon.jsx'

function ProjectSummary({ projectId, projectData }) {
    const { data: isFavData } = useFetch(`/user/is_favourite/${projectId}/`)
    const { setData: setFavData, response: favResponse, error: favError, handleSubmit } = useSubmitData(`/user/set_favourite/${projectId}/`);

    const [isFav, setIsFav] = useState(false);

    // useeffects
    useEffect(() => {
        setFavData({ projectUid: projectId });
    }, []);

    useEffect(() => {
        if (favResponse?.success === true) {
            setIsFav(true);
        }
    }, [favResponse]);
    useEffect(() => {
        if (isFavData?.success === true) {
            setIsFav(isFavData.data)
        }
    }, [isFavData]);

    // Handlers
    const handleSetFav = (e) => {
        e.preventDefault();
        handleSubmit();
    }

    return (
        <ContentCard>

            {
                projectData && (
                    <>
                        <div className="flex flex-row items-center">
                            <div className="">
                                <CardTitle svg={<StarIcon />} title={<>{projectData.ProjectName}</>} />
                            </div>
                            <div className="flex flex-1 justify-end h-full">
                                {
                                    !isFav && (
                                        <div className="flex flex-row h-full items-center">
                                            <div className="flex text-center items-center h-full pr-5">
                                                <Link to="#" onClick={handleSetFav}>Sett som favoritt</Link>
                                            </div>
                                            <div className="flex items-center h-full">
                                                <BookMarkIcon />
                                            </div>
                                        </div>
                                    )
                                }
                            </div>
                        </div>

                        <div className="border-0 p-3 rounder-lg">
                            <div className="mb-1 text-grey-text dark:text-dark-grey-text">
                                <h4>Prosjektbeskrivelse</h4>
                            </div>
                            <div className="mb-10 whitespace-pre-wrap">
                                {projectData.ProjectDescription}
                            </div>

                            <div className="text-grey-text dark:text-dark-grey-text mb-1">
                                <h4>Kravspesifikasjon</h4>
                            </div>

                            <div className="mb-10">
                                {
                                    projectData?.SpecUid ? (
                                        <Link to={`/specifications/${projectData.SpecUid}`}>{projectData.SpecificationName}</Link>
                                    ) : (
                                        <>
                                            Ingen kravspesifikasjon satt
                                        </>
                                    )
                                }

                            </div>
                            <div className="text-grey-text dark:text-dark-grey-text mb-1">
                                <h4>Prosjektert areal</h4>
                            </div>
                            <div>
                                {
                                    projectData?.area ? (
                                        <>
                                            {projectData.area.toLocaleString()} m<sup>2</sup>
                                        </>
                                    ) : (
                                        <>
                                            Ingen rom er lagt til
                                        </>
                                    )
                                }
                            </div>
                        </div>
                    </>

                )
            }

        </ContentCard>
    );
}
export default ProjectSummary;