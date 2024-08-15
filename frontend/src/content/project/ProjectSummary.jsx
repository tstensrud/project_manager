import { Link } from 'react-router-dom';
import useFetch from '../../hooks/useFetch'
import StarIcon from '../../assets/svg/starIcon.svg?react';
import CardTitle from '../../layout/CardTitle';

function ProjectSummary({ projectId }) {
    const { data, loading, error } = useFetch(`/project_api/${projectId}/`)
    return (
        <>
            <div className="cards">
                <div className="information [ card ]">
                    {
                        data && data.data.area ? (
                            <>
                            <CardTitle svg={<StarIcon />} title={<>{data && data.data.ProjectName} oppsummert</>} />

                                <h4>Prosjektbeskrivelse</h4>
                                <p className="info">{data && data.data.ProjectDescription} </p>
                                <h4>Kravspesifikasjon</h4>
                                <p className="info">
                                    <Link to={`/specifications/${data.data.SpecUid}/${projectId}`}>{data && data.data.SpecificationName}</Link>
                                </p>
                                <h4>Prosjektert areal</h4>
                                <p className="info">
                                    {data && data.data.area.toLocaleString()} m<sup>2</sup>
                                </p>
                            </>
                        ) : (
                            <>Ingen data lagt til. <br />{data && data.error}</>
                        )
                    }
                </div>
            </div>
        </>
    );
}
export default ProjectSummary;