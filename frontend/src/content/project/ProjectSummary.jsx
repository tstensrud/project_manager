import { Link } from 'react-router-dom';

// Hooks
import useFetch from '../../hooks/useFetch'

// Components
import StarIcon from '../../assets/svg/starIcon.jsx';
import CardTitle from '../../layout/CardTitle';
import LoadingSpinner from '../../layout/LoadingSpinner';
import ContentCard from '../../layout/ContentCard';

function ProjectSummary({ projectId }) {
    const { data, loading, error } = useFetch(`/project_api/${projectId}/`)

    return (
        <ContentCard>
            {
                loading && loading === true ? (
                    <LoadingSpinner />
                ) : (
                    <>
                        {
                            data && data.data ? (
                                <>
                                    <CardTitle svg={<StarIcon />} title={<>{data?.data.ProjectName}</>} />
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