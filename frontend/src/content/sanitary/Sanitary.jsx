import { useParams } from 'react-router-dom';

import useFetch from '../../hooks/useFetch'
import TapwaterIcon from '../../assets/svg/tapWaterIcon.svg?react';
import SubTitleComponent from '../../layout/SubTitleComponent.jsx';
import BuildingSummary from './BuildingSummary';
import LoadingSpinner from '../../layout/LoadingSpinner';

function Sanitary() {
    const { projectId } = useParams();

    // Hooks
    const { data, loading, refetch } = useFetch(`/project_api/${projectId}/sanitary/buildings/`);

    return (
        <>
            <SubTitleComponent svg={<TapwaterIcon />} headerText={"Sanitæranlegg - oppsummering"} projectName={""} projectNumber={""} />
            <div className='main-content'>
                {
                    loading && loading === true ? (
                        <LoadingSpinner />
                    ) : (
                        <div className="flex-container-row">
                            {
                                data && data.building_data === null ? (
                                    <p className="p-description">{data.error}</p>
                                ) : (
                                    data && data.building_data && Object.keys(data.building_data).map((key) => (
                                        <BuildingSummary buildingUid={data.building_data[key].uid} projectId={projectId} key={data.building_data[key].uid} />
                                    )
                                ))
                            }
                        </div>
                    )
                }
            </div>
        </>
    );
}

export default Sanitary;