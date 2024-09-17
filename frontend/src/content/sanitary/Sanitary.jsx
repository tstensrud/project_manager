import { useParams } from 'react-router-dom';

import useFetch from '../../hooks/useFetch'
import TapwaterIcon from '../../assets/svg/tapWaterIcon.jsx';
import SubTitleComponent from '../../layout/SubTitleComponent.jsx';
import BuildingSummary from './BuildingSummary';
import LoadingSpinner from '../../layout/LoadingSpinner';
import MainContentContainer from '../../layout/MainContentContainer.jsx';

function Sanitary() {
    const { projectId } = useParams();

    // Hooks
    const { data, loading } = useFetch(`/project_api/${projectId}/sanitary/buildings/`);

    return (
        <>
            <SubTitleComponent svg={<TapwaterIcon />} headerText={"Sanitæranlegg - oppsummering"} projectName={""} projectNumber={""} />
            <MainContentContainer>
                {
                    loading && loading === true ? (
                        <LoadingSpinner text="bygg" />
                    ) : (
                        <div className="flex justify-center flex-row w-full flex-wrap">
                            {
                                data && data.building_data === null ? (
                                    <p className="text-primary-color text-xs">{data.error}</p>
                                ) : (
                                    data && data.building_data && Object.keys(data.building_data).map((key) => (
                                        <BuildingSummary buildingUid={data.building_data[key].uid} projectId={projectId} key={data.building_data[key].uid} />
                                    )
                                ))
                            }
                        </div>
                    )
                }
            </MainContentContainer>
        </>
    );
}

export default Sanitary;