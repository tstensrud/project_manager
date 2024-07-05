import { Link } from 'react-router-dom';
import useFetch from '../../hooks/useFetch'

function ProjectSummary({projectId}) {
    const {data, loading, error} = useFetch(`/project_api/${projectId}/`)
    return (
        <>
            <div className="cards">
                <div className="information [ card ]">
                    <h2 className="card-title">{data && data.data.ProjectName} oppsummert</h2>
                    <h4>Prosjektbeskrivelse</h4>
                    <p className="info">{data && data.data.ProjectDescription} </p>
                    <h4>Kravspesifikasjon</h4>
                    <p className="info">
                        <Link url="">{data && data.data.SpecificationName}</Link>
                    </p>
                    <h4>Prosjektert areal</h4>
                    <p className="info">
                        {data && data.data.area.toLocaleString()} m<sup>2</sup>
                    </p>
                </div>
            </div>
        </>
    );
}
export default ProjectSummary;