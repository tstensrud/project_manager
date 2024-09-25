import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';

// Hooks and utils
import useFetch from '../../hooks/useFetch'

// Components
import HeatingIcon from '../../assets/svg/heatingIcon.jsx'
import SubTitleComponent from '../../layout/SubTitleComponent';
import ToggleSettingsButton from './ToggleSettingsButton';
import MainContentContainer from '../../layout/MainContentContainer.jsx';
import SortingButtons from '../../layout/SortingButtons.jsx';
import HeatingTable from './HeatingTable.jsx';
import LoadingSpinner from '../../layout/LoadingSpinner.jsx';

function Heating() {
    const { projectId } = useParams();

    // Fetches
    const { data: buildingData, refetch: buildingReFetch, loading } = useFetch(`/project_api/${projectId}/buildings/get_project_buildings/`);

    // State changes between child components
    const [settingsUpdatedState, setSettingsUpdatedState] = useState(false);

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
                        <LoadingSpinner text="bygg" />
                    ) : (
                        <>
                            <div className="overflow-y-hidden flex flex-col justify-center items-center mr-5 ml-5 h-32">
                                <SortingButtons buildings={buildings} currentBuilding={currentBuilding} sortButtonClick={sortButtonClick} />
                                <div className="mt-3">
                                    {
                                        currentBuilding !== -1 &&
                                        <ToggleSettingsButton onSettingsButtonUpdate={handleSettingsButtonUpdate} buildingUid={buildings[currentBuilding].uid} buttonText={`Parametre for varme`} />
                                    }
                                </div>
                            </div>
                            {
                                currentBuilding === -1 ? (
                                    <div className="w-full flex justify-center mt-12">
                                        Velg bygg
                                    </div>
                                ) : (
                                    <HeatingTable settingsUpdatedState={settingsUpdatedState} projectId={projectId} buildingUid={buildings[currentBuilding].uid} />
                                )
                            }
                        </>
                    )
                }


            </MainContentContainer>
        </>
    );
}

export default Heating;