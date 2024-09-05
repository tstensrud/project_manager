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
                                            <CardTitle svg={<StarIcon />} title={<>{data && data.data.ProjectName}</>} />
                                            <div className="content-card-inner-container">
                                                <div style={{ marginBottom: "10px" }} className="grey-text">
                                                    <h4>Prosjektbeskrivelse</h4>
                                                </div>
                                                <div style={{ marginBottom: "20px" }}>
                                                    {data && data.data.ProjectDescription}
                                                </div>

                                                <div style={{ marginBottom: "10px" }} className="grey-text">
                                                    <h4>Kravspesifikasjon</h4>
                                                </div>

                                                <div style={{ marginBottom: "20px" }}>
                                                    <Link to={`/specifications/${data.data.SpecUid}`}>{data && data.data.SpecificationName}</Link>
                                                </div>
                                                <div style={{ marginBottom: "10px" }} className="grey-text">
                                                    <h4>Prosjektert areal</h4>
                                                </div>
                                                <div>
                                                    {data && data.data.area !== null && data.data.area.toLocaleString()} m<sup>2</sup>
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <>{data && data.error}</>
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