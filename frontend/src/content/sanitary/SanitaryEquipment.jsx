import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import useFetch from '../../hooks/useFetch.jsx'

import TapwaterIcon from '../../assets/svg/tapWaterIcon.jsx';
import SubTitleComponent from '../../layout/SubTitleComponent.jsx';
import TableTop from '../../layout/TableTop.jsx';
import HelpBox from './HelpBox.jsx';
import MainContentContainer from '../../layout/MainContentContainer.jsx';
import SortingButtons from '../../layout/SortingButtons.jsx';
import SanitaryEquipmentTable from './SanitaryEquipmentTable.jsx';
import LoadingSpinner from '../../layout/LoadingSpinner.jsx';

function SanitaryEquipment() {
    const { projectId } = useParams();

    // Initial fetch of data
    const { data: buildingData, loading } = useFetch(`/project_api/${projectId}/buildings/get_project_buildings/`);

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


    // Handlers
    const sortButtonClick = (index) => {
        setCurrentBuilding(index);
    }

    return (
        <>
            <SubTitleComponent svg={<TapwaterIcon />} headerText={"Sanitærutstyr"} projectName={""} projectNumber={""} />
            <MainContentContainer>
                {
                    loading ? (
                        <LoadingSpinner text="bygg" />
                    ) : (
                        <>
                            <SortingButtons buildings={buildings} currentBuilding={currentBuilding} sortButtonClick={sortButtonClick} />
                            {
                                currentBuilding === -1 ? (
                                    <div className="w-full flex justify-center mt-14">
                                        Velg bygg
                                    </div>
                                ) : (
                                    <>
                                        <TableTop info={<HelpBox />} />
                                        <SanitaryEquipmentTable projectId={projectId} buildingUid={buildings[currentBuilding].uid} />
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

export default SanitaryEquipment;
