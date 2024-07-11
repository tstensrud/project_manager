import { useState, useEffect, useContext } from 'react'
import { useParams } from 'react-router-dom';
import { GlobalContext } from '../../GlobalContext';

import useFetch from '../../hooks/useFetch'
import HeatingIcon from '../../assets/svg/heatingIcon.svg?react'
import SubTitleComponent from '../../layout/SubTitleComponent';
import TableHeaderComponent from "../../tables/TableHeaderComponent";
import HeatingTableRowComponent from './HeatingTableRowComponent';
import MessageBox from '../../layout/MessageBox';
import ToggleSettingsButton from './ToggleSettingsButton';
import BuildingSummary from './BuildingSummary';

function Heating () {
    const {projectId} = useParams();
    const columnTitles = [
        {text: "#"},
        {text: "Etg"},
        {text: "Romnr"},
        {text: <>Høyde <br/>m</>},
        {text: <>Yttervegg <br/> m<sup>2</sup></>},
        {text: <>Innervegg <br/>m<sup>2</sup></>},
        {text: <>Vindu/dør <br/>m<sup>2</sup></>},
        {text: <>Tak <br/>m<sup>2</sup></>},
        {text: <>Gulv grunn <br/>m<sup>2</sup></>},
        {text: <>Gulv fritt <br/>m<sup>2</sup></>},
        {text: <>&#8721; varmetap<br/> W</>},
        {text: <>Valgt varme<br/> W</>},
        {text: <>W/m<sup>2</sup></>},
        {text: "Varmekilde"},
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
        }
        
    }

    return (
        <>
            {roomError && roomError.error && roomError.error !== null ? (<MessageBox message={roomError.error} /> ) : (<></>)}
            {buildingDataError && buildingDataError.error && buildingDataError.error !== null ? (<MessageBox message={buildingDataError.error} /> ) : (<></>)}
            <SubTitleComponent>
                <HeatingIcon /> Varmetapsberegninger
            </SubTitleComponent>
            <div className='main-content'>
                <div className="text-container-above-tables">
                    
                    <div className="float-container">                   
                        {buildingSummaryData && <BuildingSummary data={buildingSummaryData[0]}/>}
                    </div>

                    <div className="float-container-bottom-right">
                    {activeSortButton !== null && activeSortButton !== "all" ? <ToggleSettingsButton onSettingsButtonUpdate={handleSettingsButtonUpdate}  msgToParent={handleChildMessage} buildingUid={activeSortButton} /> : ''}
                        &nbsp;
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
                                    sortedBuildings.map((room, index) => <HeatingTableRowComponent index={index} settingsUpdateState={settingsUpdatedState} msgToParent={handleChildMessage} key={room.uid} roomId={room.uid} />)
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

export default Heating;