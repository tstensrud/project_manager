import { useEffect, useState } from 'react';

// Hooks and utils
import useFetch from '../../hooks/useFetch'

// Components
import StarIcon from '../../assets/svg/starIcon.jsx';
import CardTitle from '../../layout/CardTitle';
import ContentCard from '../../layout/ContentCard';
import useSubmitData from '../../hooks/useSubmitData.jsx';
import Linkbutton from '../../layout/Linkbutton.jsx';

function ProjectSummary({ projectId, projectData }) {
    const { data: isFavData, loading: isFavLoading } = useFetch(`/user/is_favourite/${projectId}/`)
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
                                    !isFavLoading && (
                                        <>
                                            {
                                                !isFav && (
                                                    <div onClick={handleSetFav} className="group cursor-pointer flex flex-row h-full items-center p-2 rounded-lg border dark:border-dark-default-border-color border-primary-color  hover:bg-accent-color hover:border-accent-color hover:dark:text-dark-primary-color dark:bg-dark-secondary-color hover:dark:border-dark-accent-color transition duration-200">
                                                        <div className="flex text-sm text-primary-color dark:text-dark-primary-color transition duration-200 text-center items-center h-full pr-3 group-hover:dark:text-dark-primary-color group-hover:text-secondary-color">
                                                            Sett som favoritt
                                                        </div>
                                                        <div className="flex items-center h-full">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" strokeWidth="2" className="stroke-primary-color dark:stroke-dark-primary-color fill-none group-hover:stroke-secondary-color group-hover:dark:stroke-dark-primary-color  transition duration-200" strokeLinecap="round" strokeLinejoin="round">
                                                                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                                                            </svg>
                                                        </div>
                                                    </div>
                                                )
                                            }
                                        </>
                                    )
                                }
                            </div>
                        </div>

                        <div className="pt-3">
                            <div className="pb-5">
                                {projectData.ProjectNumber}
                            </div>
                            <div className="pb-5 whitespace-pre-wrap text-sm">
                                {projectData.ProjectDescription}
                            </div>

                            <div className="flex text-sm">
                                {
                                    projectData?.SpecUid ? (
                                        <Linkbutton icon={false} url={`/specifications/${projectData.SpecUid}`} text={projectData.SpecificationName} />
                                    ) : (
                                        <>
                                            Ingen kravspesifikasjon satt
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