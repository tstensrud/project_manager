import React, { useState, useEffect, useContext } from 'react'

// Hooks and utils
import useFetch from '../../hooks/useFetch';
import { GlobalContext } from '../../context/GlobalContext';

// Components
import HeatingIcon from '../../assets/svg/heatingIcon.jsx'
import SubTitleComponent from '../../layout/SubTitleComponent';
import ToggleSettingsButton from './ToggleSettingsButton';
import MainContentContainer from '../../layout/MainContentContainer.jsx';
import SortingButtons from '../../layout/SortingButtons.jsx';
import HeatingTable from './HeatingTable.jsx';
import LoadingSpinner from '../../layout/LoadingSpinner.jsx';
import MessageBox from '../../layout/MessageBox.jsx';
import { ERROR_FALLBACK_MSG } from '../../utils/globals.js';

function Heating() {
    const { activeProject } = useContext(GlobalContext);

    // Fetches
    const { data: buildingData, error: buildingDataError, refetch: buildingReFetch, loading } = useFetch(activeProject ? `/project_api/${activeProject}/buildings/get_project_buildings/` : null);

    // State changes between child components
    const [settingsUpdatedState, setSettingsUpdatedState] = useState(0);

    // Sorting
    const [buildings, setBuildings] = useState([]);
    const [currentBuilding, setCurrentBuilding] = useState(-1);

    // useEffects
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
            <SubTitleComponent svg={<HeatingIcon />} headerText={"Varmetapsberegninger"} projectName={""} projectNumber={""} />
            <MainContentContainer>
                {
                    loading ? (
                        <LoadingSpinner text="data" />
                    ) : (
                        <>
                            {
                                buildingData?.success && (
                                    <>
                                        <div className="overflow-y-hidden flex flex-row justify-center items-center mr-5 ml-5 h-32">
                                            <SortingButtons buildings={buildings} currentBuilding={currentBuilding} sortButtonClick={sortButtonClick} />
                                            {
                                                currentBuilding !== -1 &&
                                                <ToggleSettingsButton onSettingsButtonUpdate={handleSettingsButtonUpdate} buildingUid={buildings[currentBuilding].uid} buttonText={`Parametre for varme`} />
                                            }
                                        </div>
                                        {
                                            currentBuilding === -1 ? (
                                                <div className="w-full flex justify-center mt-12">
                                                    Velg bygg.
                                                </div>
                                            ) : (
                                                <HeatingTable settingsUpdatedState={settingsUpdatedState} projectId={activeProject} buildingUid={buildings[currentBuilding].uid} />
                                            )
                                        }
                                    </>
                                )
                            }

                            {
                                buildingData?.success === false && <MessageBox error message={`${buildingData?.message ?? ERROR_FALLBACK_MSG}`} closeable={false} />
                            }
                            {
                                buildingDataError && <MessageBox error={true} message={`${buildingDataError} @ Loading building data`} closeable={false} />
                            }
                        </>
                    )
                }
            </MainContentContainer>
        </>
    );
}

export default Heating;