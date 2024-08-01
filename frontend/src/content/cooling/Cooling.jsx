import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';

import useFetch from '../../hooks/useFetch'
import { customSortFloors } from '../../utils/customSortFloors.js'

import CoolingIcon from '../../assets/svg/coolingIcon.svg?react'
import SubTitleComponent from '../../layout/SubTitleComponent';
import TableHeaderComponent from "../../tables/TableHeaderComponent";
import CoolingTableRowComponent from './CoolingTableRowComponent';
import MessageBox from '../../layout/MessageBox';
import ToggleSettingsButton from './ToggleSettingsButton';
import TableTop from '../../layout/TableTop.jsx';

function Cooling () {
    const {projectId} = useParams();
    const columnTitles = [
        {text: "#"},
        {text: "Etasje"},
        {text: "Romnr"},
        {text: <>Romtemp <br/> &#176;C</>},
        {text: <>Temp vent<br/> &#176;C</>},
        {text: "W/pers"},
        {text: <>Lys<br/> W/m<sup>2</sup></>},
        {text: <>Ustyr<br/> W/m<sup>2</sup></>},
        {text: <>Soltilskudd<br/> W/m<sup>2</sup></>},
        {text: <>Solreduksjon<br/> (0-1,0)</>},
        {text: <>&#8721; Internlast<br/> W</>},
        {text: <>Kjøling utstyr<br/> W</>},
        {text: <>&#8721; kjøling<br/> W</>},
        {text: <>Ekstra vent. <br />m<sup>3</sup>/h</>},
        {text: "Merknad"}
    ];
    // Error messages from child component
    const [childMessage, setChildMessage] = useState('');

    // Fetches
    const {data: roomData, error: roomError, refetch: roomRefetch} = useFetch(`/project_api/${projectId}/rooms/`);
    const {data: buildingData, error: buildingDataError, refetch: buildingReFetch} = useFetch(`/project_api/${projectId}/buildings/`);

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
    },[activeSortButton, buildingData])

    useEffect(() => {
        setSortedBuildings(roomData && roomData.room_data && roomData.room_data.filter((room) => room.BuildingId === buildingId));
    },[roomData]);

    useEffect(() => {
        if (buildingSummaryData && buildingSummaryData[0] && buildingSummaryData[0].floor_summaries) {
            const floorSummaryKeys = Object.keys(buildingSummaryData[0].floor_summaries);
            const sortedKeys = customSortFloors(floorSummaryKeys);
            setFloors(sortedKeys);
            //console.log(sortedKeys)
        }
    },[buildingSummaryData]);

    // Handlers
    const handleChildMessage = (msg) => {
        //console.log("Child message received:", msg);
            if (msg !== undefined) {
            if (msg === "update") {
                roomRefetch();
            }
            if (msg === "updateSummaries") {
                buildingReFetch();
            }
            setChildMessage('');
        }
    }

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
            //history.push(`/projects/${projectId}/heating?building=${selectedBuildingUid}`);
        }
        
    }

    return (
        <>
            {roomError && roomError.error && roomError.error !== null ? (<MessageBox message={roomError.error} /> ) : (<></>)}
            {buildingDataError && buildingDataError.error && buildingDataError.error !== null ? (<MessageBox message={buildingDataError.error} /> ) : (<></>)}
            <SubTitleComponent>
                <CoolingIcon /> Kjølebehovsberegninger
            </SubTitleComponent>
            <div className='main-content'>
                <div className="text-container-above-tables">

                    {activeSortButton !== null && activeSortButton !== "all" ? <ToggleSettingsButton onSettingsButtonUpdate={handleSettingsButtonUpdate} msgToParent={handleChildMessage} buildingUid={activeSortButton} /> : ''}&nbsp;
                    {buildingData && buildingData.building_data && Object.keys(buildingData.building_data).map((key, index) => (
                        <><button key={index} name={buildingData.building_data[key].uid} onClick={sortButtonClick} className={activeSortButton === buildingData.building_data[key].uid ? `table-sorting-button-active` : `table-sorting-button`}>
                            {buildingData.building_data[key].BuildingName}</button> &nbsp;</>
                    ))}

                </div>
                <TableTop />
                <div className="table-wrapper">
                    <table className="fl-table">
                        <thead>
                            <TableHeaderComponent headers={columnTitles} />
                        </thead>
                        <tbody>
                            {
                                floors && floors.map(floor => (
                                    <React.Fragment key={floor}>
                                        {
                                            sortedBuildings && sortedBuildings.length > 0 ? (
                                                sortedBuildings.filter(room => room.Floor === floor).map((room, index) => <CoolingTableRowComponent index={index} settingsUpdateState={settingsUpdatedState} msgToParent={handleChildMessage} totalColumns={columnTitles.length} key={room.uid} roomId={room.uid} />)
                                            ) : (<></>)
                                        }
                                        <tr className="summary-row">
                                            <td>
                                                <br /><br />
                                            </td>
                                            <td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>
                                        </tr>
                                    </React.Fragment>
                                ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}

export default Cooling;