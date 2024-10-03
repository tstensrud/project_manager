import { useContext } from 'react';

// hooks and utils
import { GlobalContext } from '../../context/GlobalContext';
import useFetch from '../../hooks/useFetch'

// components
import TapwaterIcon from '../../assets/svg/tapWaterIcon.jsx';
import SubTitleComponent from '../../layout/SubTitleComponent.jsx';
import BuildingSummary from './BuildingSummary';
import LoadingSpinner from '../../layout/LoadingSpinner';
import MainContentContainer from '../../layout/MainContentContainer.jsx';

function Sanitary() {
    const { activeProject } = useContext(GlobalContext);

    // Hooks
    const { data, loading } = useFetch(activeProject ? `/project_api/${activeProject}/sanitary/buildings/` : null);

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
                                    data?.building_data && Object.values(data.building_data).map((value) => (
                                        <BuildingSummary buildingUid={value} projectId={activeProject} key={value} />
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