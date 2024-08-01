import React, { useState, useEffect} from 'react'
import { useParams } from 'react-router-dom';

import useFetch from '../../hooks/useFetch'
import { customSortFloors } from '../../utils/customSortFloors.js'

import VentilationIcon from '../../assets/svg/ventilationIcon.svg?react';
import SubTitleComponent from '../../layout/SubTitleComponent';
import TableHeaderComponent from "../../tables/TableHeaderComponent";
import VentilationTableRowComponent from "./VentilationTableRowComponent";
import MessageBox from '../../layout/MessageBox';
import TableTop from '../../layout/TableTop';

//import BuildingSummary from './BuildingSummary';

function Ventilation () {
    const {projectId} = useParams();

    const columnTitles = [  
        {text: "#"},
        {text: "Etasje"},
        {text: "Rom"},
        {text: <>Sum personer <br/> m<sup>3</sup>/h</>},
        {text: <>Sum emisjon <br/> m<sup>3</sup>/h</>},
        {text: <>Prosess <br/> m<sup>3</sup>/h</>},
        {text: <>Dimensjonert <br/> m<sup>3</sup>/h</>},
        {text: <>Tilluft<br/> m<sup>3</sup>/h</>},
        {text: <>Avtrekk<br/> m<sup>3</sup>/h</>},
        {text: <>m<sup>3</sup>/m<sup>2</sup></>},
        {text: <>Min <br/>m<sup>3</sup>/h</>},
        {text: "System"},
        {text: "Merknad"}
    ];

    // Initial fetch of data
    const {data: roomData, loading} = useFetch(`/project_api/${projectId}/rooms/`);
    const {data: buildingData, refetch: buildingReFetch} = useFetch(`/project_api/${projectId}/buildings/`);
    const {data: ventSystemData } = useFetch(`/project_api/${projectId}/systems/`);

    // Error messages from child component
    const [childMessage, setChildMessage] = useState('');

    // Sorting
    const [sortedBuildings, setSortedBuildings] = useState(roomData?.room_data || []);
    const [buildingId, setBuildingId] = useState(null);
    const [activeSortButton, setActivesortButton] = useState(null);
    const [buildingSummaryData, setBuildingSummaryData] = useState(null);
    const [floors, setFloors] = useState([]);

    console.log(buildingSummaryData)

    // useEffects
    useEffect(() => {
        const filteredBuildingData = buildingData && buildingData.building_data
        ? buildingData.building_data.filter((building) => building.uid === activeSortButton)
        : null;
        setBuildingSummaryData(filteredBuildingData);
    },[activeSortButton, buildingData]);

    useEffect(() => {
        setSortedBuildings(roomData && roomData.room_data && roomData.room_data.filter((room) => room.BuildingUid === buildingId));
    },[roomData]);

    useEffect(() => {
        if (buildingSummaryData && buildingSummaryData[0] && buildingSummaryData[0].floor_summaries) {
            const floorSummaryKeys = Object.keys(buildingSummaryData[0].floor_summaries);
            const sortedKeys = customSortFloors(floorSummaryKeys);
            setFloors(sortedKeys);
        }
    },[buildingSummaryData]);

    // Handlers
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
                <VentilationIcon /> Luftmengdetabeller
            </SubTitleComponent>
            <div className='main-content'>
                <div className="text-container-above-tables no-print">

               
                        {buildingData && buildingData.building_data && Object.keys(buildingData.building_data).map((key, index) => (
                            <><button key={index} name={buildingData.building_data[key].uid} onClick={sortButtonClick} className={activeSortButton === buildingData.building_data[key].uid ? `table-sorting-button-active` : `table-sorting-button`}>
                                {buildingData.building_data[key].BuildingName}</button> &nbsp;</>
                            ))}
                    
                </div>
                <TableTop />
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
                                                floors && floors.map(floor => (
                                                    <React.Fragment key={floor}>
                                                        {
                                                            sortedBuildings && sortedBuildings.length > 0 ? (
                                                                sortedBuildings.filter(room => room.Floor === floor).map((room, index) => <VentilationTableRowComponent index={index} msgToParent={handleChildMessage} key={room.uid} allRoomData={room} totalColumns={columnTitles.length} roomId={room.uid} systems={ventSystemData} />)
                                                            ) : (<></>)
                                                        }
                                                        <tr className="summary-row">
                                                        <td><br/><br/></td><td></td><td></td><td></td><td></td><td></td>
                                                        <td>
                                                        {
                                                                    buildingSummaryData && buildingSummaryData[0]?.floor_summaries &&
                                                                    Object.keys(buildingSummaryData[0].floor_summaries)
                                                                        .filter(key => key === floor)
                                                                        .map(key => (
                                                                            <React.Fragment key={key}>
                                                                                <strong>{Number(buildingSummaryData[0].floor_summaries[key].demand.toFixed(0)).toLocaleString()}</strong>
                                                                            </React.Fragment>
                                                                        ))
                                                                }

                                                        </td>
                                                            <td>
                                                                {
                                                                    buildingSummaryData && buildingSummaryData[0]?.floor_summaries &&
                                                                    Object.keys(buildingSummaryData[0].floor_summaries)
                                                                        .filter(key => key === floor)
                                                                        .map(key => (
                                                                            <React.Fragment key={key}>
                                                                            <span className="supply-text">{Number(buildingSummaryData[0].floor_summaries[key].supply.toFixed(0)).toLocaleString()}</span>
                                                                            </React.Fragment>
                                                                        ))
                                                                }
                                                            </td>
                                                            <td>
                                                            {
                                                                    buildingSummaryData && buildingSummaryData[0]?.floor_summaries &&
                                                                    Object.keys(buildingSummaryData[0].floor_summaries)
                                                                        .filter(key => key === floor)
                                                                        .map(key => (
                                                                            <React.Fragment key={key}>
                                                                                <span className="extract-text">{Number(buildingSummaryData[0].floor_summaries[key].extract.toFixed(0)).toLocaleString()}</span>
                                                                            </React.Fragment>
                                                                        ))
                                                                }
                                                                
                                                            </td>
                                                            <td></td><td></td><td></td><td></td>
                                                        </tr>
                                                    </React.Fragment>
                                                ))}
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
                                            
                                            <th>
                                                <strong>{ buildingSummaryData?.[0]?.demand != null ? <>{Number((buildingSummaryData[0]).demand.toFixed(0)).toLocaleString()} <br/> m<sup>3</sup>/h</> : (<></>) }</strong>
                                            </th>
                                            <th>
                                                <strong>{ buildingSummaryData?.[0]?.supplyAir != null ? <>{Number((buildingSummaryData[0].supplyAir).toFixed(0)).toLocaleString()} <br/> m<sup>3</sup>/h</> : (<></>) }</strong>
                                            </th>
                                            <th>
                                                <strong>{ buildingSummaryData?.[0]?.extractAir ? <>{Number((buildingSummaryData[0].extractAir).toFixed(0)).toLocaleString()} <br/> m<sup>3</sup>/h</>: (<></>) }</strong>
                                            </th>
                                            <th></th>
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
