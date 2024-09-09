import { Link } from 'react-router-dom';
import useFetch from '../../hooks/useFetch'
import StarIcon from '../../assets/svg/starIcon.svg?react';
import CardTitle from '../../layout/CardTitle';
import LoadingSpinner from '../../layout/LoadingSpinner';

function ProjectSummary({ projectId }) {
    const { data, loading, error } = useFetch(`/project_api/${projectId}/`)

    return (
        <>
            <div className="content-card">
                <div className="content-card-container">
                    {
                        loading && loading === true ? (
                            <LoadingSpinner />
                        ) : (
                            <>
                                {
                                    data && data.data ? (
                                        <>
                                            <CardTitle svg={<StarIcon />} title={<>{data?.data.ProjectName}</>} />
                                            <div className="content-card-inner-container">
                                                <div className="mb-10 grey-text">
                                                    <h4>Prosjektbeskrivelse</h4>
                                                </div>
                                                <div className="mb-20">
                                                    {data && data.data.ProjectDescription}
                                                </div>

                                                <div className="grey-text mb-10">
                                                    <h4>Kravspesifikasjon</h4>
                                                </div>

                                                <div className="mb-20">
                                                    <Link to={`/specifications/${data.data.SpecUid}`}>{data?.data?.SpecificationName}</Link>
                                                </div>
                                                <div className="grey-text mb-10">
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


                </div>
            </div>
        </>
    );
}
export default ProjectSummary;