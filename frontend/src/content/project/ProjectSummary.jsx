import { useContext, useEffect } from 'react';
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

function ProjectSummary({ projectId }) {
    const { userUuid } = useContext(GlobalContext);
    
    const { data, loading, error } = useFetch(`/project_api/${projectId}/`);
    
    
    const { setData: setFavData, response: favResponse, error: favError, handleSubmit } = useSubmitData(`/user/${userUuid}/set_favourite/${projectId}/`);

    useEffect(() => {
        setFavData({projectUid: projectId});
    },[]);

    useEffect(() => {
        if (favResponse?.success === true) {
            console.log("Fav set")
        } 
    },[favResponse])

    const handleSetFav = (e) => {
        e.preventDefault();
        handleSubmit(e);
    }

    return (
        <ContentCard>
            {
                loading && loading === true ? (
                    <LoadingSpinner text="prosjektinfo" />
                ) : (
                    <>
                        {
                            data && data.data ? (
                                <>
                                <div className="flex flex-row">
                                    <div className="w-[80%]">
                                        <CardTitle svg={<StarIcon />} title={<>{data?.data.ProjectName}</>} />
                                    </div>
                                    <div className="flex flex-1 justify-end">
                                        <Link to="#" onClick={handleSetFav}>Sett som favoritt</Link>
                                    </div>
                                </div>
                                    
                                    <div className="border-0 p-3 rounder-lg">
                                        <div className="mb-1 text-grey-text dark:text-dark-grey-text">
                                            <h4>Prosjektbeskrivelse</h4>
                                        </div>
                                        <div className="mb-10 whitespace-pre-wrap">
                                            {data && data.data.ProjectDescription}
                                        </div>

                                        <div className="text-grey-text dark:text-dark-grey-text mb-1">
                                            <h4>Kravspesifikasjon</h4>
                                        </div>

                                        <div className="mb-10">
                                            <Link to={`/specifications/${data.data.SpecUid}`}>{data?.data?.SpecificationName}</Link>
                                        </div>
                                        <div className="text-grey-text dark:text-dark-grey-text mb-1">
                                            <h4>Prosjektert areal</h4>
                                        </div>
                                        <div>
                                            {data?.data?.area !== null && data?.data?.area.toLocaleString()} m<sup>2</sup>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>{data?.error}</>
                            )
                        }
                    </>
                )
            }

        </ContentCard>
    );
}
export default ProjectSummary;