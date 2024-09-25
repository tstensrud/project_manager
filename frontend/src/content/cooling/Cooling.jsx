import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';

// Hooks and utils
import useFetch from '../../hooks/useFetch'

// Components
import CoolingIcon from '../../assets/svg/coolingIcon.jsx'
import SubTitleComponent from '../../layout/SubTitleComponent';
import ToggleSettingsButton from './ToggleSettingsButton';
import TableTop from '../../layout/TableTop.jsx';
import HelpBox from './HelpBox.jsx';
import MainContentContainer from '../../layout/MainContentContainer.jsx';
import SortingButtons from '../../layout/SortingButtons.jsx';
import CoolingTable from './CoolingTable.jsx';
import LoadingSpinner from '../../layout/LoadingSpinner.jsx';

function Cooling() {
    const { projectId } = useParams();

    // Fetches
    const { data: buildingData, loading, refetch: buildingReFetch } = useFetch(`/project_api/${projectId}/buildings/get_project_buildings/`);

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
        if  (buildings.length === 1) {
            setCurrentBuilding(0);
        }
    },[buildings]);


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
                                    <>
                                        <TableTop info={<HelpBox />} />
                                        <CoolingTable settingsUpdatedState={settingsUpdatedState} projectId={projectId} buildingUid={buildings[currentBuilding].uid} />
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

export default Cooling;