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

    // Handlers
    const handleChildMessage = (msg) => {
        //console.log("Child message received:", msg);
        if (msg !== undefined) {
            if (msg === "curve") {
                refetch();
                console.log("Update curve")
            }
        }
    }
    return (
        <>
            <SubTitleComponent svg={<TapwaterIcon />} headerText={"Sanitæranlegg - oppsummering"} projectName={""} projectNumber={""} />
            <div className='main-content'>
                {
                    loading && loading === true ? (
                        <>
                            <LoadingSpinner />
                        </>
                    ) : (
                        <>
                            <div className="flex-container-row">
                                {
                                    data && data.building_data === null ? (
                                        <p className="p-description">{data.error}</p>
                                    ) : (
                                        data && data.building_data && Object.keys(data.building_data).map((key, index) => (
                                            <BuildingSummary buildingUid={data.building_data[key].uid} msgToParent={handleChildMessage} projectId={projectId} key={index} />
                                        )))
                                }
                            </div>
                        </>)
                }
            </div>
        </>
    );
}

export default Sanitary;