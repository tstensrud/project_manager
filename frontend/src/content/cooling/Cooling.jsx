import React, { useState, useEffect, useContext } from 'react'

// Hooks and utils
import useFetch from '../../hooks/useFetch';
import { GlobalContext } from '../../context/GlobalContext';

// Components
import CoolingIcon from '../../assets/svg/coolingIcon.jsx'
import SubTitleComponent from '../../layout/SubTitleComponent';
import ToggleSettingsButton from './ToggleSettingsButton';
import MainContentContainer from '../../layout/MainContentContainer.jsx';
import SortingButtons from '../../layout/SortingButtons.jsx';
import CoolingTable from './CoolingTable.jsx';
import LoadingSpinner from '../../layout/LoadingSpinner.jsx';
import MessageBox from '../../layout/MessageBox.jsx';

function Cooling() {
    const { activeProject } = useContext(GlobalContext);

    // Fetches
    const { data: buildingData, error: buildingDataError, loading, refetch: buildingReFetch } = useFetch(activeProject ? `/project_api/${activeProject}/buildings/get_project_buildings/` : null);

    // State changes between child components
    const [settingsUpdatedState, setSettingsUpdatedState] = useState(false);

    // Sorting
    const [buildings, setBuildings] = useState([]);
    const [currentBuilding, setCurrentBuilding] = useState(-1);

    // Use effects
    useEffect(() => {
        if (buildingData?.success === true) {
            const fetchedBuildingData = Object.keys(buildingData.data).map(key => buildingData.data[key])
            setBuildings(fetchedBuildingData);
        }
    }, [buildingData]);

    useEffect(() => {
        if (buildings.length === 1) {
            setCurrentBuilding(0);
        }
    }, [buildings]);


    // Handlers
    const handleSettingsButtonUpdate = async () => {
        setSettingsUpdatedState(prevState => !prevState);
        await buildingReFetch();
    }

    const sortButtonClick = (index) => {
        setCurrentBuilding(index);
    }

    return (
        <>
            <SubTitleComponent svg={<CoolingIcon />} headerText={"Kjølebehovsberegninger"} projectName={""} projectNumber={""} />
            <MainContentContainer>
                {buildingDataError && <MessageBox closeable={false} message={buildingDataError} />}
                {
                    loading ? (
                        <LoadingSpinner text="bygg" />
                    ) : (
                        <>
                            {
                                buildingData?.success === true ? (
                                    <>
                                        <div className="overflow-y-hidden flex flex-col justify-center items-center mr-5 ml-5 h-32">
                                            <SortingButtons buildings={buildings} currentBuilding={currentBuilding} sortButtonClick={sortButtonClick} />
                                            <div className="mt-3">
                                                {
                                                    currentBuilding !== -1 &&
                                                    <ToggleSettingsButton onSettingsButtonUpdate={handleSettingsButtonUpdate} buildingUid={buildings[currentBuilding].uid} buttonText={`Parametre for kjøling`} />
                                                }
                                            </div>
                                        </div>
                                        {
                                            currentBuilding === -1 ? (
                                                <div className="w-full flex justify-center mt-14">
                                                    Velg bygg
                                                </div>
                                            ) : (
                                                <CoolingTable settingsUpdatedState={settingsUpdatedState} projectId={activeProject} buildingUid={buildings[currentBuilding].uid} />
                                            )
                                        }
                                    </>
                                ) : (
                                    <MessageBox message={`${buildingData?.message ?? 'Feil har oppstått. Gå inn "min side" eller velg prosjekt og åpne prosjektet du vil jobbe med på nytt.'}`} closeable={false} />
                                )
                            }
                        </>
                    )
                }
            </MainContentContainer>
        </>
    );
}

export default Cooling;