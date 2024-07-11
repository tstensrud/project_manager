import { useState, useEffect, useContext } from 'react'
import { useParams } from 'react-router-dom';
import { GlobalContext } from '../../GlobalContext';

import useFetch from '../../hooks/useFetch'

import VentilationIcon from '../../assets/svg/ventilationIcon.svg?react'
import SubTitleComponent from '../../layout/SubTitleComponent';
import TableHeaderComponent from "../../tables/TableHeaderComponent";
import VentilationTableRowComponent from "./VentilationTableRowComponent";
import MessageBox from '../../layout/MessageBox';
import BuildingSummary from './BuildingSummary';

function Ventilation () {
    const {projectId} = useParams();
    const {setActiveProject} = useContext(GlobalContext);

    const columnTitles = [  
        {text: "#"},
        {text: "Etasje"},
        {text: "Rom"},
        {text: <>Sum personer <br/> m<sup>3</sup>/h</>},
        {text: <>Sum emisjon <br/> m<sup>3</sup>/h</>},
        {text: <>Prosess <br/> m<sup>3</sup>/h</>},
        {text: <>Minimum <br/> m<sup>3</sup>/h</>},
        {text: <>Dimensjonert <br/> m<sup>3</sup>/h</>},
        {text: <>Tilluft<br/> m<sup>3</sup>/h</>},
        {text: <>Avtrekk<br/> m<sup>3</sup>/h</>},
        {text: <>m<sup>3</sup>/m<sup>2</sup></>},
        {text: <>Min <br/>m<sup>3</sup>/h</>},
        {text: "System"},
        {text: "Kommentar"}
    ];

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

    useEffect(() => {
        const filteredBuildingData = buildingData && buildingData.building_data
        ? buildingData.building_data.filter((building) => building.uid === activeSortButton)
        : null;
        setBuildingSummaryData(filteredBuildingData);
    },[activeSortButton, buildingData])

    useEffect(() => {
        setSortedBuildings(roomData && roomData.room_data && roomData.room_data.filter((room) => room.BuildingUid === buildingId));
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
            setSortedBuildings(roomData.room_data.filter((room) => room.BuildingUid === sortBy));
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
                        {buildingData && buildingData.building_data && Object.keys(buildingData.building_data).map((key, index) => (
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
                                <table className="fl-table">
                                    <thead>
                                        <TableHeaderComponent headers={columnTitles} />
                                    </thead>
                                    <tbody>
                                        {
                                            sortedBuildings && sortedBuildings.length > 0 ? (
                                                sortedBuildings.map((room, index) => <VentilationTableRowComponent index={index} msgToParent={handleChildMessage} key={room.uid} roomId={room.uid} systems={ventSystemData}/>)
                                            ) : (<><tr><td><>Velg bygg</></td></tr></>)
                                        }
                                    </tbody>
                                    <tfoot>
                                    <tr>
                                            <th></th>
                                            <th></th>
                                            <th>
                                                <strong>Sum</strong>
                                            </th>
                                            <th></th>
                                            <th></th>
                                            <th></th>
                                            <th></th>
                                            <th>
                                                <strong>{ buildingSummaryData && buildingSummaryData[0] ? <>{(buildingSummaryData[0].demand.toFixed(0)).toLocaleString()} <br/> m<sup>3</sup>/h</> : (<></>) }</strong>
                                            </th>
                                            <th>
                                                <strong>{ buildingSummaryData && buildingSummaryData[0] ? <>{(buildingSummaryData[0].supplyAir.toFixed(0)).toLocaleString()} <br/> m<sup>3</sup>/h</> : (<></>) }</strong>
                                            </th>
                                            <th>
                                                <strong>{ buildingSummaryData && buildingSummaryData[0] ? <>{(buildingSummaryData[0].extractAir.toFixed(0)).toLocaleString()} <br/> m<sup>3</sup>/h</>: (<></>) }</strong>
                                            </th>
                                            <th></th>
                                            <th></th>
                                            <th></th>
                                            <th></th>
                                        </tr>
                                    </tfoot>
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
