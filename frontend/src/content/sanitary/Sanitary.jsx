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

function Sanitary() {
    const { activeProject } = useContext(GlobalContext);

    // Hooks
    const { data, loading } = useFetch(activeProject ? `/project_api/${activeProject}/sanitary/buildings/` : null);

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
                                data?.success ? (
                                    <div className="flex justify-center flex-row w-full flex-wrap">
                                        {
                                            data?.data && Object.values(data.data).map((value) => (
                                                <BuildingSummary buildingUid={value} projectId={activeProject} key={value} />
                                            ))
                                        }
                                    </div>
                                ) : (
                                    <>
                                        {
                                            !loading && <MessageBox message={data?.message ?? 'Feil har oppstått. Gå inn "min side" eller velg prosjekt og åpne prosjektet du vil jobbe med på nytt.'} closeable={false} />
                                        }
                                    </>
                                )
                            }
                        </>
                    )
                }
            </MainContentContainer>
        </>
    );
}

export default Sanitary;