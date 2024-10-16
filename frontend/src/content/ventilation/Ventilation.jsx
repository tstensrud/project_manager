import React, { useState, useEffect, useContext } from 'react'

// Hooks
import useFetch from '../../hooks/useFetch';
import { GlobalContext } from '../../context/GlobalContext';

// Components
import VentilationIcon from '../../assets/svg/ventilationIcon.jsx';
import SubTitleComponent from '../../layout/SubTitleComponent';
import MainContentContainer from '../../layout/MainContentContainer.jsx';
import SortingButtons from '../../layout/SortingButtons.jsx';
import VentilationTable from './VentilationTable.jsx';
import LoadingSpinner from '../../layout/LoadingSpinner.jsx';
import MessageBox from '../../layout/MessageBox.jsx';
import { ERROR_FALLBACK_MSG } from '../../utils/globals.js';

//import BuildingSummary from './BuildingSummary';

function Ventilation() {
    const { activeProject } = useContext(GlobalContext);

    // Initial fetch of data
    const { data: buildingData, loading, error } = useFetch(activeProject ? `/project_api/${activeProject}/buildings/get_project_buildings/` : null);

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
    const sortButtonClick = (index) => {
        setCurrentBuilding(index);
    }

    return (
        <>
            
            <SubTitleComponent svg={<VentilationIcon />} headerText={"Luftmengdetabeller"} projectName={""} projectNumber={""} />
            <MainContentContainer>
                {
                    loading ? (
                        <LoadingSpinner />
                    ) : (
                        <>
                            {
                                buildingData?.success && (
                                    <>
                                        <SortingButtons buildings={buildings} currentBuilding={currentBuilding} sortButtonClick={sortButtonClick} />
                                        {
                                            currentBuilding === -1 ? (
                                                <div className="w-full flex justify-center mt-12">
                                                    Velg bygg
                                                </div>
                                            ) : (
                                                <VentilationTable projectId={activeProject} buildingUid={buildings[currentBuilding].uid} />
                                            )
                                        }
                                    </>
                                )
                            }
                            {buildingData?.success === false && <MessageBox message={buildingData.message ?? ERROR_FALLBACK_MSG} closeable={false} />}
                            {error && <MessageBox error closeable={false} message={error ?? ERROR_FALLBACK_MSG} />}
                        </>
                    )
                }
            </MainContentContainer>
        </>
    );
}

export default Ventilation;
