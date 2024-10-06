import React, { useState, useEffect, useContext } from 'react';

// hooks and utils
import { GlobalContext } from '../../context/GlobalContext';
import useFetch from '../../hooks/useFetch.jsx'

// components
import TapwaterIcon from '../../assets/svg/tapWaterIcon.jsx';
import SanitaryShaftTable from './SanitaryShaftTable.jsx';
import SubTitleComponent from '../../layout/SubTitleComponent.jsx';
import SortingButtons from '../../layout/SortingButtons.jsx';
import MainContentContainer from '../../layout/MainContentContainer.jsx';
import LoadingSpinner from '../../layout/LoadingSpinner.jsx';
import MessageBox from '../../layout/MessageBox.jsx';

function SanitaryShafts() {
    const { activeProject } = useContext(GlobalContext);

    // Initial fetch of data
    const { data: buildingData, loading: buildingDataLoading, error: buildingDataError } = useFetch(activeProject ? `/project_api/${activeProject}/buildings/get_project_buildings/` : null);

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
            <SubTitleComponent svg={<TapwaterIcon />} headerText={"Sanitærsjakter"} projectName={""} projectNumber={""} />
            <MainContentContainer>
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
                                                <div className="w-full flex justify-center mt-12">
                                                    Velg bygg
                                                </div>
                                            ) : (
                                                <SanitaryShaftTable projectId={activeProject} buildingUid={buildings[currentBuilding].uid} />
                                            )
                                        }
                                    </>
                                ) : (
                                    <>
                                        {
                                            !buildingDataLoading && <MessageBox message={`${buildingData?.message ?? 'Feil har oppstått. Gå inn "min side" eller velg prosjekt og åpne prosjektet du vil jobbe med på nytt.'}`} closeable={false} />
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

export default SanitaryShafts;