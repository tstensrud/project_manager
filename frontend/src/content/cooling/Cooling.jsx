import { useState, useEffect, useContext } from 'react'
import { useParams } from 'react-router-dom';
import { GlobalContext } from '../../GlobalContext';

import useFetch from '../../hooks/useFetch'

import CoolingIcon from '../../assets/svg/coolingIcon.svg?react'
import SubTitleComponent from '../../layout/SubTitleComponent';
import TableHeaderComponent from "../../tables/TableHeaderComponent";
import CoolingTableRowComponent from './CoolingTableRowComponent';
import MessageBox from '../../layout/MessageBox';
import ToggleSettingsButton from './ToggleSettingsButton';

function Cooling () {
    const {projectId} = useParams();
    const columnTitles = [
        {text: "#"},
        {text: "Etasje"},
        {text: "Romnr"},
        {text: "Romtemp &#176;C"},
        {text: "Temp vent &#176;C"},
        {text: "W/pers"},
        {text: "Lys W/m&sup2;"},
        {text: "Ustyr W/m&sup2;"},
        {text: "Soltilskudd W/m&sup2;"},
        {text: "Solreduksjon (0-1,0"},
        {text: "&#8721; Internlast W"},
        {text: "Kjøling utstyr W"},
        {text: "&#8721; kjøling"},
        {text: "Ekstra vent.m&sup3;/h"},
        {text: "Kommentar"}
    ];
    // Error messages from child component
    const [childMessage, setChildMessage] = useState('');

    // Fetches
    const {data: roomData, loading: roomLoading, error: roomError, refetch: roomRefetch} = useFetch(`/project_api/${projectId}/rooms/`);
    const {data: buildingData, loading: buildingDataLoading, error: buildingDataError, refetch: buildingReFetch} = useFetch(`/project_api/${projectId}/buildings/`);

        // State changes between child components
        const [settingsUpdatedState, setSettingsUpdatedState] = useState(false);

        // Sorting
        const [sortedBuildings, setSortedBuildings] = useState(roomData?.room_data || []);
        const [buildingId, setBuildingId] = useState(null);
        const [activeSortButton, setActivesortButton] = useState(null);
        const [buildingSummaryData, setBuildingSummaryData] = useState(null);
    
        // Use effects
        useEffect(() => {
            const filteredBuildingData = buildingData && buildingData.building_data ? buildingData.building_data.filter((building) => building.uid === activeSortButton) : null;
            setBuildingSummaryData(filteredBuildingData);
        },[activeSortButton, buildingData])
    
        useEffect(() => {
            setSortedBuildings(roomData && roomData.room_data && roomData.room_data.filter((room) => room.BuildingId === buildingId));
        },[roomData]);
    
        // Handlers
        const handleChildMessage = (msg) => {
            console.log("Child message received:", msg);
             if (msg !== undefined) {
                if (msg === "update") {
                    roomRefetch();
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

                    <div className="float-container">
                        <div className='float-container-bottom'>
                            {activeSortButton !== null && activeSortButton !== "all" ? <ToggleSettingsButton onSettingsButtonUpdate={handleSettingsButtonUpdate}  msgToParent={handleChildMessage} buildingUid={activeSortButton} /> : ''}
                        </div>

                    </div>

                    <div className="float-container-bottom-right">
                        {buildingData && buildingData.building_data && Object.keys(buildingData.building_data).map((key, index) => (
                            <><button key={index} name={buildingData.building_data[key].uid} onClick={sortButtonClick} className={activeSortButton === buildingData.building_data[key].uid ? `table-sorting-button-active` : `table-sorting-button`}>
                                {buildingData.building_data[key].BuildingName}</button> &nbsp;</>
                        ))}
                    </div>
                </div>
                <div className="table-wrapper">
                    <table className="fl-table">
                        <thead>
                            <TableHeaderComponent headers={columnTitles} />
                        </thead>
                        <tbody>
                            {
                                sortedBuildings && sortedBuildings.length > 0 ? (
                                    sortedBuildings.map((room, index) => <CoolingTableRowComponent index={index} settingsUpdateState={settingsUpdatedState} msgToParent={handleChildMessage} key={room.uid} roomId={room.uid} />)
                                ) : (
                                    <>
                                        <tr>
                                            <td>
                                                <>Velg bygg</>
                                            </td>
                                        </tr>
                                    </>
                                )
                            }
                            <tr>
                                <td>

                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}

export default Cooling;