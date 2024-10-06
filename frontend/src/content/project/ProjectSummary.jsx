import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

// Hooks and utils
import useFetch from '../../hooks/useFetch'

// Components
import StarIcon from '../../assets/svg/starIcon.jsx';
import CardTitle from '../../layout/CardTitle';
import ContentCard from '../../layout/ContentCard';
import useSubmitData from '../../hooks/useSubmitData.jsx';

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
                                        <div onClick={handleSetFav} className="group cursor-pointer flex flex-row h-full items-center hover:text-primary-color hover:dark:text-dark-primary-color">
                                            <div className="flex text-accent-color dark:text-dark-accent-color transition duration-300 text-center items-center h-full pr-3 group-hover:text-primary-color group-hover:dark:text-dark-primary-color">
                                                Sett som favoritt
                                            </div>
                                            <div className="flex items-center h-full">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" strokeWidth="2" className="stroke-accent-color dark:stroke-dark-accent-color fill-none group-hover:stroke-primary-color group-hover:dark:stroke-dark-primary-color transition duration-300" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                                                </svg>
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
                            <div className="mb-10 whitespace-pre-wrap text-sm">
                                {projectData.ProjectDescription}
                            </div>

                            <div className="text-grey-text dark:text-dark-grey-text mb-1">
                                <h4>Kravspesifikasjon</h4>
                            </div>

                            <div className="mb-10 text-sm">
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
                            <div className="text-sm">
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