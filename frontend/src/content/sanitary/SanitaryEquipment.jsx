import React, { useState, useEffect } from 'react';
import { useContext } from 'react';

// hooks and utils
import { GlobalContext } from '../../context/GlobalContext';
import useFetch from '../../hooks/useFetch.jsx'

// components
import TapwaterIcon from '../../assets/svg/tapWaterIcon.jsx';
import SubTitleComponent from '../../layout/SubTitleComponent.jsx';
import MainContentContainer from '../../layout/MainContentContainer.jsx';
import SortingButtons from '../../layout/SortingButtons.jsx';
import SanitaryEquipmentTable from './SanitaryEquipmentTable.jsx';
import LoadingSpinner from '../../layout/LoadingSpinner.jsx';
import MessageBox from '../../layout/MessageBox.jsx';

function SanitaryEquipment() {
    const { activeProject } = useContext(GlobalContext);

    // Initial fetch of data
    const { data: buildingData, loading: buildingDataLoading, error: buildingDataError } = useFetch(activeProject ? `/project_api/${activeProject}/buildings/get_project_buildings/` : null);

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
    const sortButtonClick = (index) => {
        setCurrentBuilding(index);
    }

    return (
        <>
            <SubTitleComponent svg={<TapwaterIcon />} headerText={"Sanitærutstyr"} projectName={""} projectNumber={""} />
            <MainContentContainer>
                {buildingDataError && <MessageBox message={buildingDataError} closeable={true} />}
                {
                    buildingDataLoading ? (
                        <LoadingSpinner text="bygg" />
                    ) : (
                        <>
                            {
                                buildingData?.success ? (
                                    <>
                                        <SortingButtons buildings={buildings} currentBuilding={currentBuilding} sortButtonClick={sortButtonClick} />
                                        {
                                            currentBuilding === -1 ? (
                                                <div className="w-full flex justify-center mt-14">
                                                    Velg bygg
                                                </div>
                                            ) : (
                                                <>

                                                    <SanitaryEquipmentTable projectId={activeProject} buildingUid={buildings[currentBuilding].uid} />
                                                </>
                                            )
                                        }
                                    </>
                                ) : (
                                    <MessageBox message={buildingData?.message ?? ''} closeable={false} />

                                )
                            }
                        </>
                    )
                }
            </MainContentContainer>
        </>
    );
}

export default SanitaryEquipment;
