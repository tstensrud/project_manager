import { useState, useEffect, useContext, useRef } from 'react'
import { useParams } from 'react-router-dom';
import { GlobalContext } from '../../GlobalContext';

import useFetch from '../../hooks/useFetch'

import VentilationIcon from '../../assets/svg/ventilationIcon.svg?react'
import SubTitleComponent from '../../layout/SubTitleComponent';
import TableHeaderComponent from "../../tables/TableHeaderComponent";
import VentilationTableRowComponent from "../../tables/VentilationTableRowComponent";
import MessageBox from '../../layout/MessageBox';
import BuildingSummary from './BuildingSummary';

function Ventilation () {
    const {projectId} = useParams();
    const {setActiveProject} = useContext(GlobalContext);

    // Initial fetch of data
    const {data: roomData, loading: roomLoading, error: roomError, refetch: roomRefetch} = useFetch(`/project_api/${projectId}/rooms/`);
    const {data: buildingData, loading: buildingDataLoading, error: buildingDataError, refetch: buildingReFetch} = useFetch(`/project_api/${projectId}/buildings/`);
    const {data: ventSystemData, loading: ventsSystemLoading, error: ventSystemError, refetch: ventSystemRefect} = useFetch(`/project_api/${projectId}/systems/`);
    
    // Error messages from child component
    const [childMessage, setChildMessage] = useState('');

    // Sorting
    const [sortedBuildings, setSortedBuildings] = useState(roomData?.room_data || []);
    const [buildingId, setBuildingId] = useState(null);
    const [activeSortButton, setActivesortButton] = useState(null);
    const [buildingSummaryData, setBuildingSummaryData] = useState(null);

    const columnTitles = [  
        {text: "#"},
        {text: "Bygg"},
        {text: "Etasje"},
        {text: "Romnr"},
        {text: "Romnavn"},
        {text: "Sum personer m3/h"},
        {text: "Sum emisjon m3/h"},
        {text: "Prosess m3/h"},
        {text: "Minimum m3/h"},
        {text: "Dimensjonert m3/h"},
        {text: "Tilluft"},
        {text: "Avtrekk"},
        {text: "m3/m2"},
        {text: "Min m3/h"},
        {text: "System"},
        {text: "Kommentar"}
    ];

    useEffect(() => {
        const filteredBuildingData = buildingData && buildingData.building_data
        ? buildingData.building_data.filter((building) => building.uid === activeSortButton)
        : null;
        setBuildingSummaryData(filteredBuildingData);
    },[activeSortButton, buildingData])

    useEffect(() => {
        setActiveProject(projectId);
    },[]);  

    useEffect(() => {
        setSortedBuildings(roomData && roomData.room_data.filter((room) => room.BuildingId === buildingId));
    },[roomData]);

    const handleChildMessage = (msg) => {
         if (msg !== undefined) {
            if (msg === "updateSummaries") {
                buildingReFetch();
            }
            setChildMessage(msg);
        }
    }

    const sortButtonClick = (e) => {
        e.preventDefault();
        const sortBy = e.target.name;
        setActivesortButton(sortBy);

        if (sortBy === "all") {
            setBuildingId(null);
            setSortedBuildings(roomData.room_data)
            setBuildingSummaryData(null);
        } else {
            setBuildingId(sortBy);
            setSortedBuildings(roomData.room_data.filter((room) => room.BuildingId === sortBy));
            //setBuildingSummaryData(buildingData.building_data.filter((building_data) => building_data.uid === sortBy));
        }
    }

    return (
        <>
            {childMessage.error && <MessageBox message={childMessage.error} />}

            <SubTitleComponent>
                <VentilationIcon /> Luftmengdetabell
            </SubTitleComponent>
            <div className='main-content'>
                <div className="text-container-above-tables">

                    <div className="float-container">
                        {buildingSummaryData && <BuildingSummary data={buildingSummaryData[0]}/>}
                    </div>

                    <div className="float-container-bottom-right">
                        <button name="all" key="all" onClick={sortButtonClick} className={activeSortButton === "all" ? `table-sorting-button-active` : `table-sorting-button`}>Alle</button> &nbsp;
                        {buildingData && Object.keys(buildingData.building_data).map((key, index) => (
                            <><button key={index} name={buildingData.building_data[key].uid} onClick={sortButtonClick} className={activeSortButton === buildingData.building_data[key].uid ? `table-sorting-button-active` : `table-sorting-button`}>
                                {buildingData.building_data[key].BuildingName}</button> &nbsp;</>
                            ))}
                    </div>
                </div>
                {
                    roomData ? (
                        roomData.room_data === null ? (
                            <p>Ingen rom lagt til</p>
                        ) : (
                            <div className="table-wrapper">
                                <table className="fl-table" id="roomsTableVentilation">
                                    <thead>
                                        <TableHeaderComponent headers={columnTitles} />
                                    </thead>
                                    <tbody>

                                        {
                                            sortedBuildings && sortedBuildings.length > 0 ? (
                                                sortedBuildings.map((room) => <VentilationTableRowComponent msgToParent={handleChildMessage} key={room.uid} roomId={room.uid} systems={ventSystemData}/>)
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
                        )
                    ) : (<span>&nbsp;&nbsp;&nbsp;Laster inn rom</span>)
                }
            </div>

        </>
    );
}

export default Ventilation;