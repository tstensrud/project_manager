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
import MessageBox from '../../layout/MessageBox.jsx';
import { ERROR_FALLBACK_MSG } from '../../utils/globals.js';

function Sanitary() {
    const { activeProject } = useContext(GlobalContext);

    // Hooks
    const { data, loading, error } = useFetch(activeProject ? `/project_api/${activeProject}/sanitary/buildings/` : null);

    return (
        <>
            <SubTitleComponent svg={<TapwaterIcon />} headerText={"Sanitæranlegg - oppsummering"} projectName={""} projectNumber={""} />
            <MainContentContainer>
                {
                    loading ? (
                        <LoadingSpinner text="bygg" />
                    ) : (
                        <>
                            {
                                data?.success && (
                                    <div className="flex justify-evenly flex-row w-full flex-wrap">
                                        {
                                            data?.data && Object.values(data.data).map((value) => (
                                                <BuildingSummary buildingUid={value} projectId={activeProject} key={value} />
                                            ))
                                        }
                                    </div>
                                )}
                            {data?.success === false && <MessageBox message={data?.message ?? ERROR_FALLBACK_MSG} closeable={false} />}
                            {error && <MessageBox error message={error ?? ERROR_FALLBACK_MSG} closeable={false} />}
                        </>
                    )
                }
            </MainContentContainer>
        </>
    );
}

export default Sanitary;