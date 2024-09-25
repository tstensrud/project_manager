import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';

// Hooks
import useFetch from '../../hooks/useFetch'

// Components
import VentilationIcon from '../../assets/svg/ventilationIcon.jsx';
import SubTitleComponent from '../../layout/SubTitleComponent';
import TableTop from '../../layout/TableTop';
import HelpBox from './HelpBox.jsx';
import MainContentContainer from '../../layout/MainContentContainer.jsx';
import SortingButtons from '../../layout/SortingButtons.jsx';
import VentilationTable from './VentilationTable.jsx';
import LoadingSpinner from '../../layout/LoadingSpinner.jsx';
import MessageBox from '../../layout/MessageBox.jsx';

//import BuildingSummary from './BuildingSummary';

function Ventilation() {
    const { projectId } = useParams();

    // Initial fetch of data
    const { data: buildingData, loading, error } = useFetch(`/project_api/${projectId}/buildings/get_project_buildings/`);

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
        if  (buildings.length === 1) {
            setCurrentBuilding(0);
        }
    },[buildings]);


    // Handlers
    const sortButtonClick = (index) => {
        setCurrentBuilding(index);
    }

    return (
        <>
            {error && <MessageBox message={error} />}
            <SubTitleComponent svg={<VentilationIcon />} headerText={"Luftmengdetabeller"} projectName={""} projectNumber={""} />
            <MainContentContainer>
                {
                    loading ? (
                        <LoadingSpinner />
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
                                        <TableTop info={<HelpBox />} />
                                        <VentilationTable projectId={projectId} buildingUid={buildings[currentBuilding].uid} />
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

export default Ventilation;
