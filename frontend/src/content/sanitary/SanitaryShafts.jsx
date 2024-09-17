import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import useFetch from '../../hooks/useFetch.jsx'

import TapwaterIcon from '../../assets/svg/tapWaterIcon.jsx';
import SanitaryShaftTable from './SanitaryShaftTable.jsx';
import SubTitleComponent from '../../layout/SubTitleComponent.jsx';
import TableTop from '../../layout/TableTop.jsx';
import HelpBoxShafts from './HelpBoxShafts.jsx';
import SortingButtons from '../../layout/SortingButtons.jsx';
import MainContentContainer from '../../layout/MainContentContainer.jsx';
import LoadingSpinner from '../../layout/LoadingSpinner.jsx';



function SanitaryShafts() {
    const { projectId } = useParams();

    // Initial fetch of data
    const { data: buildingData, loading } = useFetch(`/project_api/${projectId}/buildings/get_project_buildings/`);

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


    // Handlers
    const sortButtonClick = (index) => {
        setCurrentBuilding(index);
    }

    return (
        <>
            <SubTitleComponent svg={<TapwaterIcon />} headerText={"Sanitærsjakter"} projectName={""} projectNumber={""} />
            <MainContentContainer>
                {
                    loading ? (
                        <LoadingSpinner text="bygg" />
                    ) : (
                        <>
                            <SortingButtons buildings={buildings} currentBuilding={currentBuilding} sortButtonClick={sortButtonClick} />
                            {
                                currentBuilding === -1 ? (
                                    <>
                                        <div className="w-full flex justify-center mt-12">
                                            Velg bygg
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <TableTop info={<HelpBoxShafts />} />
                                        <SanitaryShaftTable projectId={projectId} buildingUid={buildings[currentBuilding].uid} />
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

export default SanitaryShafts;