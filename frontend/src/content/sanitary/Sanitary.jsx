import React, { useState, useEffect} from 'react'
import { useParams } from 'react-router-dom';

import useFetch from '../../hooks/useFetch'
import { customSortFloors } from '../../utils/customSortFloors.js'

import TapwaterIcon from '../../assets/svg/tapWaterIcon.svg?react';
import SubTitleComponent from '../../layout/SubTitleComponent';
import SanitaryTableRowComponent from "./SanitaryTableRowComponent";
import MessageBox from '../../layout/MessageBox';
import TableTop from '../../layout/TableTop';

//import BuildingSummary from './BuildingSummary';

function Sanitary () {
    const {projectId} = useParams();

    // Initial fetch of data
    const {data: roomData, loading} = useFetch(`/project_api/${projectId}/rooms/`);
    const {data: buildingData, refetch: buildingReFetch} = useFetch(`/project_api/${projectId}/buildings/`);
    
    // Error messages from child component
    const [childMessage, setChildMessage] = useState('');

    // Sorting
    const [sortedBuildings, setSortedBuildings] = useState(roomData?.room_data || []);
    const [buildingId, setBuildingId] = useState(null);
    const [activeSortButton, setActivesortButton] = useState(null);
    const [buildingSummaryData, setBuildingSummaryData] = useState(null);
    const [floors, setFloors] = useState([]);

    //console.log(buildingSummaryData);

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
                console.log("Building refetch called")
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
                <TapwaterIcon /> Sanitærutstyr
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
                                        <th width="2%">#</th>
                                        <th width="2%">Etasje</th>
                                        <th width="10%">Rom</th>
                                        <th width="6%">Sjakt</th>
                                        <th width="6%">1/14" servant</th>
                                        <th width="6%">Utslagsvask</th>
                                        <th width="6%">WC</th>                                        
                                        <th width="6%">Urinal</th>
                                        <th width="6%">Oppvaskmaskin</th>
                                        <th width="6%">Dusjbatteri</th>
                                        <th width="6%">Badekar</th>
                                        <th width="6%">Vaskemaskin</th>
                                        <th width="6%">Tappekran <br/>inne</th>
                                        <th width="6%">Tappekran <br/>ute</th>
                                        <th width="6%">Brannskap</th>
                                        <th width="6%">Sluk<br/>75mm</th>
                                        <th width="6%">Sluk<br/>110mm</th>
                                    </thead>
                                    <tbody>
                                            {
                                                floors && floors.map(floor => (
                                                    <React.Fragment key={floor}>
                                                        {
                                                            sortedBuildings && sortedBuildings.length > 0 ? (
                                                                sortedBuildings.filter(room => room.Floor === floor).map((room, index) => <SanitaryTableRowComponent index={index} msgToParent={handleChildMessage} key={room.uid} allRoomData={room} totalColumns={17} roomId={room.uid} />)
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
                                                                                
                                                                            </React.Fragment>
                                                                        ))
                                                                }
                                                                
                                                            </td>
                                                            <td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>
                                                        </tr>
                                                    </React.Fragment>
                                                ))}
                                    </tbody>
                                    <tfoot>
                                    <tr>
                                            <th></th>
                                            <th></th>
                                            <th></th>
                                            <th></th>
                                            <th><strong>{ buildingSummaryData?.[0]?.sanitary_summary.sink_1_14_inch != null ? <>{Number((buildingSummaryData[0]).sanitary_summary.sink_1_14_inch)} <br/> stk</> : (<></>) }</strong></th>
                                            <th><strong>{ buildingSummaryData?.[0]?.sanitary_summary.sink_large != null ? <>{Number((buildingSummaryData[0]).sanitary_summary.sink_large)} <br/> stk</> : (<></>) }</strong></th>
                                            <th><strong>{ buildingSummaryData?.[0]?.sanitary_summary.wc != null ? <>{Number((buildingSummaryData[0]).sanitary_summary.wc)} <br/> stk</> : (<></>) }</strong></th>
                                            <th><strong>{ buildingSummaryData?.[0]?.sanitary_summary.urinal != null ? <>{Number((buildingSummaryData[0]).sanitary_summary.urinal)} <br/> stk</> : (<></>) }</strong></th>
                                            <th><strong>{ buildingSummaryData?.[0]?.sanitary_summary.shower != null ? <>{Number((buildingSummaryData[0]).sanitary_summary.shower)} <br/> stk</> : (<></>) }</strong></th>
                                            <th><strong>{ buildingSummaryData?.[0]?.sanitary_summary.tub != null ? <>{Number((buildingSummaryData[0]).sanitary_summary.tub)} <br/> stk</> : (<></>) }</strong></th>
                                            <th><strong>{ buildingSummaryData?.[0]?.sanitary_summary.dishwasher != null ? <>{Number((buildingSummaryData[0]).sanitary_summary.dishwasher)} <br/> stk</> : (<></>) }</strong></th>
                                            <th><strong>{ buildingSummaryData?.[0]?.sanitary_summary.washing_machine != null ? <>{Number((buildingSummaryData[0]).sanitary_summary.washing_machine)} <br/> stk</> : (<></>) }</strong></th>
                                            <th><strong>{ buildingSummaryData?.[0]?.sanitary_summary.tap_water_outlet_inside != null ? <>{Number((buildingSummaryData[0]).sanitary_summary.tap_water_outlet_inside)} <br/> stk</> : (<></>) }</strong></th>
                                            <th><strong>{ buildingSummaryData?.[0]?.sanitary_summary.tap_water_outlet_outside != null ? <>{Number((buildingSummaryData[0]).sanitary_summary.tap_water_outlet_outside)} <br/> stk</> : (<></>) }</strong></th>
                                            <th><strong>{ buildingSummaryData?.[0]?.sanitary_summary.firehose != null ? <>{Number((buildingSummaryData[0]).sanitary_summary.firehose)} <br/> stk</> : (<></>) }</strong></th>
                                            <th><strong>{ buildingSummaryData?.[0]?.sanitary_summary.drain_75_mm != null ? <>{Number((buildingSummaryData[0]).sanitary_summary.drain_75_mm)} <br/> stk</> : (<></>) }</strong></th>
                                            <th><strong>{ buildingSummaryData?.[0]?.sanitary_summary.drain_110_mm != null ? <>{Number((buildingSummaryData[0]).sanitary_summary.drain_110_mm)} <br/> stk</> : (<></>) }</strong></th>
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

export default Sanitary;
