import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';

import useFetch from '../../hooks/useFetch'
import { customSortFloors } from '../../utils/customSortFloors.js'

// Components
import CoolingIcon from '../../assets/svg/coolingIcon.jsx'
import SubTitleComponent from '../../layout/SubTitleComponent';
import CoolingTableRowComponent from './CoolingTableRowComponent';
import MessageBox from '../../layout/MessageBox';
import ToggleSettingsButton from './ToggleSettingsButton';
import TableTop from '../../layout/TableTop.jsx';
import LoadingSpinner from '../../layout/LoadingSpinner.jsx';
import HelpBox from './HelpBox.jsx';
import MainContentContainer from '../../layout/MainContentContainer.jsx';
import SortingButton from '../../layout/formelements/SortingButton.jsx';
import ActiveSortingButton from '../../layout/formelements/ActiveSortingButton.jsx'

function Cooling() {
    const { projectId } = useParams();

    // Fetches
    const { data: roomData, loading: roomDataLoading, error: roomError, refetch: roomRefetch } = useFetch(`/project_api/${projectId}/rooms/`);
    const { data: buildingData, loading: buildingDataLoading, error: buildingDataError, refetch: buildingReFetch } = useFetch(`/project_api/${projectId}/cooling/buildings/`);

    // State changes between child components
    const [settingsUpdatedState, setSettingsUpdatedState] = useState(false);

    // Sorting
    const [sortedBuildings, setSortedBuildings] = useState(roomData?.room_data || []);
    const [buildingId, setBuildingId] = useState(null);
    const [activeSortButton, setActivesortButton] = useState(null);
    const [buildingSummaryData, setBuildingSummaryData] = useState(null);
    const [floors, setFloors] = useState([]);

    // Use effects
    useEffect(() => {
        const filteredBuildingData = buildingData && buildingData.building_data ? buildingData.building_data.filter((building) => building.uid === activeSortButton) : null;
        setBuildingSummaryData(filteredBuildingData);
    }, [activeSortButton, buildingData])

    useEffect(() => {
        setSortedBuildings(roomData && roomData.room_data && roomData.room_data.filter((room) => room.BuildingId === buildingId));
    }, [roomData]);

    useEffect(() => {
        if (buildingSummaryData && buildingSummaryData[0] && buildingSummaryData[0].floor_summaries) {
            const floorSummaryKeys = Object.keys(buildingSummaryData[0].floor_summaries);
            const sortedKeys = customSortFloors(floorSummaryKeys);
            setFloors(sortedKeys);
            //console.log(sortedKeys)
        }
    }, [buildingSummaryData]);

    // Handlers
    const handleSettingsButtonUpdate = () => {
        setSettingsUpdatedState(prevState => !prevState);
    }


    const sortButtonClick = (e) => {
        e.preventDefault();
        const selectedBuildingUid = e.target.name;
        setActivesortButton(selectedBuildingUid);

        if (selectedBuildingUid === "all") {
            setBuildingId(null);
            setSortedBuildings(roomData.room_data)
            setBuildingSummaryData(null);
        } else {
            setBuildingId(selectedBuildingUid);
            setSortedBuildings(roomData.room_data.filter((room) => room.BuildingUid === selectedBuildingUid));
        }
    }

    return (
        <>
            {roomError?.error && roomError.error !== null ? (<MessageBox message={roomError.error} />) : (<></>)}
            {buildingDataError?.error && buildingDataError?.error !== null ? (<MessageBox message={buildingDataError.error} />) : (<></>)}
            <SubTitleComponent svg={<CoolingIcon />} headerText={"Kjølebehovsberegninger"} projectName={""} projectNumber={""} />
            <MainContentContainer>
                {
                    roomDataLoading === true || buildingDataLoading === true ? (
                        <LoadingSpinner />
                    ) : (
                        <>
                            <div className="overflow-y-hidden flex justify-center items-center mr-5 ml-5 h-32">
                                {activeSortButton !== null && activeSortButton !== "all" ? <ToggleSettingsButton onSettingsButtonUpdate={handleSettingsButtonUpdate} buildingUid={activeSortButton} /> : ''}&nbsp;
                                {
                                    buildingData?.building_data && Object.keys(buildingData.building_data).map((key, index) => (
                                        <button key={index} name={buildingData.building_data[key].uid} onClick={sortButtonClick} className={activeSortButton === buildingData.building_data[key].uid ? `table-sorting-button-active` : `table-sorting-button`}>
                                            {buildingData.building_data[key].BuildingName}
                                        </button>
                                    ))
                                }
                            </div>
                            {
                                activeSortButton === null ? (
                                    <div className="w-full flex justify-center mt-14">
                                        Velg bygg
                                    </div>
                                ) : (
                                    <>
                                        <TableTop info={<HelpBox />} />
                                        <div className="flex flex-col h-[80%] overflow-y-auto">
                                            <div className="sticky ml-5 mr-5 mt-0 top-0 rounded-bl-lg rounded-br-lg bg-secondary-color z-10">
                                                <table className="fl-table">
                                                    <thead>
                                                        <tr>
                                                            <th width="2%">#</th>
                                                            {/*  <th width="5%">Etasje</th> */}
                                                            <th width="5%">Romnr</th>
                                                            <th width="5%">Romtemp <br /> &#176;C</th>
                                                            <th width="5%">Temp vent<br /> &#176;C</th>
                                                            <th width="5%">W/Pers</th>
                                                            <th width="5%">Lys<br /> W/m<sup>2</sup></th>
                                                            <th width="5%">Ustyr<br /> W/m<sup>2</sup></th>
                                                            <th width="5%">Soltilskudd<br /> W/m<sup>2</sup></th>
                                                            <th width="5%">Solreduksjon<br /> (0-1,0)</th>
                                                            <th width="5%">&#8721; Internlast<br /> W</th>
                                                            <th width="5%">Kjøling utstyr<br /> W</th>
                                                            <th width="5%">&#8721; kjøling<br /> W</th>
                                                            <th width="5%">Ekstra vent. <br />m<sup>3</sup>/h</th>
                                                            <th width="34%">Merknad</th>
                                                        </tr>
                                                    </thead>
                                                </table>
                                            </div>

                                            {
                                                floors && floors.map(floor => (
                                                    <React.Fragment key={floor}>
                                                        <div className="flex flex-col ml-5 mr-5 mt-0 h-auto rounded-bl-lg rounded-br-lg bg-secondary-color shadow-lg shadow-background-shade mb-5">

                                                            <div className="text-primary-color text-xs border-none w-full max-w-full bg-secondary-color flex justify-center">
                                                                <h3>Etasje {floor}</h3>
                                                            </div>

                                                            <table className="fl-table">
                                                                <tbody>
                                                                    {
                                                                        sortedBuildings && sortedBuildings.length > 0 ? (
                                                                            sortedBuildings.filter(room => room.Floor === floor).map((room, index) => <CoolingTableRowComponent index={index} settingsUpdateState={settingsUpdatedState} totalColumns={14} key={room.uid} roomId={room.uid} />)
                                                                        ) : (<></>)
                                                                    }
                                                                    <tr className="bg-secondary-color">
                                                                        <td>
                                                                            <br /><br />
                                                                        </td>
                                                                        <td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </React.Fragment>
                                                ))
                                            }

                                        </div>
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