import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

import useFetch from '../../hooks/useFetch.jsx'
import { customSortFloors } from '../../utils/customSortFloors.js'

import TapwaterIcon from '../../assets/svg/tapWaterIcon.svg?react';
import SubTitleComponent from '../../layout/SubTitleComponent.jsx';
import SanitaryTableRowComponent from "./SanitaryTableRowComponent.jsx";
import MessageBox from '../../layout/MessageBox.jsx';
import TableTop from '../../layout/TableTop.jsx';
import LoadingSpinner from '../../layout/LoadingSpinner.jsx';
import HelpBox from './HelpBox.jsx';

//import BuildingSummary from './BuildingSummary';

function SanitaryEquipment() {
    const { projectId } = useParams();
    const [showHelpBox, setShowHelpBox] = useState(false);

    // Initial fetch of data
    const { data: roomData, loading: roomDataLoading } = useFetch(`/project_api/${projectId}/rooms/`);
    const { data: buildingData, loading: buildingDataLoading, refetch: buildingReFetch } = useFetch(`/project_api/${projectId}/sanitary/buildings/`);

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
    }, [activeSortButton, buildingData]);

    useEffect(() => {
        setSortedBuildings(roomData && roomData.room_data && roomData.room_data.filter((room) => room.BuildingUid === buildingId));
    }, [roomData]);

    useEffect(() => {
        if (buildingSummaryData && buildingSummaryData[0] && buildingSummaryData[0].floor_summaries) {
            const floorSummaryKeys = Object.keys(buildingSummaryData[0].floor_summaries);
            const sortedKeys = customSortFloors(floorSummaryKeys);
            setFloors(sortedKeys);
        }
    }, [buildingSummaryData]);

    // Handlers
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

            <SubTitleComponent svg={<TapwaterIcon />} headerText={"Sanitærutstyr"} projectName={""} projectNumber={""} />
            <div className='main-content'>
                {
                    roomDataLoading === true ? (
                        <LoadingSpinner />
                    ) : (
                        <>
                            <div className="text-container-above-tables no-print">
                                {
                                    buildingData && buildingData.building_data && Object.keys(buildingData.building_data).map((key, index) => (
                                        <button key={index} name={buildingData.building_data[key].uid} onClick={sortButtonClick} className={activeSortButton === buildingData.building_data[key].uid ? `table-sorting-button-active` : `table-sorting-button`}>
                                            {buildingData.building_data[key].BuildingName}
                                        </button>
                                    ))
                                }
                            </div>
                            {
                                roomData ? (
                                    roomData.room_data === null ? (
                                        <div style={{ width: "100%", display: "flex", justifyContent: "center", marginTop: "50px" }}>
                                            Ingen rom lagt til
                                        </div>
                                    ) : (
                                        <>
                                            {
                                                activeSortButton === null ? (
                                                    <div style={{ width: "100%", display: "flex", justifyContent: "center", marginTop: "50px" }}>
                                                        Velg bygg
                                                    </div>
                                                ) : (
                                                    <>
                                                        <TableTop info={<HelpBox />} />
                                                        <div className="table-container">
                                                            <div className="table-header-wrapper">
                                                                <table className="fl-table">
                                                                    <thead>
                                                                        <tr>
                                                                            <th width="2%">#</th>
                                                                            {/* <th width="2%">Etasje</th> */}
                                                                            <th width="12%">Rom</th>
                                                                            <th width="5%">Sjakt</th>
                                                                            <th width="5%">1/14" servant</th>
                                                                            <th width="5%">1" servant</th>
                                                                            <th width="5%">Drikkefontene</th>
                                                                            <th width="5%">Utslagsvask</th>
                                                                            <th width="5%">WC</th>
                                                                            <th width="5%">Urinal</th>
                                                                            <th width="5%">Oppvaskmaskin</th>
                                                                            <th width="5%">Dusjbatteri</th>
                                                                            <th width="5%">Badekar</th>
                                                                            <th width="5%">Vaskemaskin</th>
                                                                            <th width="5%">Tappekran <br />inne</th>
                                                                            <th width="5%">Tappekran <br />ute</th>
                                                                            <th width="5%">Brannskap</th>
                                                                            <th width="5%">Sluk<br />75mm</th>
                                                                            <th width="5%">Sluk<br />110mm</th>
                                                                        </tr>
                                                                    </thead>
                                                                </table>
                                                            </div>

                                                            {
                                                                floors && floors.map(floor => (
                                                                    <React.Fragment key={floor}>
                                                                        <div className="table-wrapper">

                                                                            <div className="table-title">
                                                                                <h3>Etasje {floor}</h3>
                                                                            </div>
                                                                            
                                                                            <table className="fl-table">
                                                                                <tbody>
                                                                                    {
                                                                                        sortedBuildings && sortedBuildings.length > 0 ? (
                                                                                            sortedBuildings.filter(room => room.Floor === floor).map((room, index) => <SanitaryTableRowComponent index={index} buildingReFetch={buildingReFetch} key={room.uid} allRoomData={room} totalColumns={18} roomId={room.uid} />)
                                                                                        ) : (<></>)
                                                                                    }
                                                                                    <tr className="summary-row">
                                                                                        <td width="2%">
                                                                                            <br />
                                                                                            <br />
                                                                                        </td>
                                                                                        <td width="12%"></td>
                                                                                        <td width="5%"></td>
                                                                                        <td width="5%"></td>
                                                                                        <td width="5%"></td>
                                                                                        <td width="5%">
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
                                                                                        <td width="5%">
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
                                                                                        <td width="5%">
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
                                                                                        <td width="5%"></td>
                                                                                        <td width="5%"></td>
                                                                                        <td width="5%"></td>
                                                                                        <td width="5%"></td>
                                                                                        <td width="5%"></td>
                                                                                        <td width="5%"></td>
                                                                                        <td width="5%"></td>
                                                                                        <td width="5%"></td>
                                                                                        <td width="5%"></td>
                                                                                        <td width="5%"></td>
                                                                                    </tr>
                                                                                </tbody>
                                                                            </table>
                                                                        </div>
                                                                    </React.Fragment>
                                                                ))}
                                                            <div style={{ marginBottom: "30px" }}>
                                                                <div className="table-wrapper">
                                                                    <table className="fl-table">
                                                                        <tfoot>
                                                                            <tr>
                                                                                <th width="2%"></th>
                                                                                {/* <th></th> */}
                                                                                <th width="12%"></th>
                                                                                <th width="5%"></th>
                                                                                <th width="5%"><strong>{buildingSummaryData && buildingSummaryData?.[0]?.sanitary_summary.sink_1_14_inch != null ? <>{Number((buildingSummaryData[0]).sanitary_summary.sink_1_14_inch)} <br /> stk</> : (<></>)}</strong></th>
                                                                                <th width="5%"><strong>{buildingSummaryData?.[0]?.sanitary_summary.sink_large != null ? <>{Number((buildingSummaryData[0]).sanitary_summary.sink_large)} <br /> stk</> : (<></>)}</strong></th>
                                                                                <th width="5%"><strong>{buildingSummaryData?.[0]?.sanitary_summary.drinking_fountain != null ? <>{Number((buildingSummaryData[0]).sanitary_summary.drinking_fountain)} <br /> stk</> : (<></>)}</strong></th>
                                                                                <th width="5%"><strong>{buildingSummaryData?.[0]?.sanitary_summary.sink_utility != null ? <>{Number((buildingSummaryData[0]).sanitary_summary.sink_utility)} <br /> stk</> : (<></>)}</strong></th>
                                                                                <th width="5%"><strong>{buildingSummaryData?.[0]?.sanitary_summary.wc != null ? <>{Number((buildingSummaryData[0]).sanitary_summary.wc)} <br /> stk</> : (<></>)}</strong></th>
                                                                                <th width="5%"><strong>{buildingSummaryData?.[0]?.sanitary_summary.urinal != null ? <>{Number((buildingSummaryData[0]).sanitary_summary.urinal)} <br /> stk</> : (<></>)}</strong></th>
                                                                                <th width="5%"><strong>{buildingSummaryData?.[0]?.sanitary_summary.dishwasher != null ? <>{Number((buildingSummaryData[0]).sanitary_summary.dishwasher)} <br /> stk</> : (<></>)}</strong></th>
                                                                                <th width="5%"><strong>{buildingSummaryData?.[0]?.sanitary_summary.shower != null ? <>{Number((buildingSummaryData[0]).sanitary_summary.shower)} <br /> stk</> : (<></>)}</strong></th>
                                                                                <th width="5%"><strong>{buildingSummaryData?.[0]?.sanitary_summary.tub != null ? <>{Number((buildingSummaryData[0]).sanitary_summary.tub)} <br /> stk</> : (<></>)}</strong></th>
                                                                                <th width="5%"><strong>{buildingSummaryData?.[0]?.sanitary_summary.washing_machine != null ? <>{Number((buildingSummaryData[0]).sanitary_summary.washing_machine)} <br /> stk</> : (<></>)}</strong></th>
                                                                                <th width="5%"><strong>{buildingSummaryData?.[0]?.sanitary_summary.tap_water_outlet_inside != null ? <>{Number((buildingSummaryData[0]).sanitary_summary.tap_water_outlet_inside)} <br /> stk</> : (<></>)}</strong></th>
                                                                                <th width="5%"><strong>{buildingSummaryData?.[0]?.sanitary_summary.tap_water_outlet_outside != null ? <>{Number((buildingSummaryData[0]).sanitary_summary.tap_water_outlet_outside)} <br /> stk</> : (<></>)}</strong></th>
                                                                                <th width="5%"><strong>{buildingSummaryData?.[0]?.sanitary_summary.firehose != null ? <>{Number((buildingSummaryData[0]).sanitary_summary.firehose)} <br /> stk</> : (<></>)}</strong></th>
                                                                                <th width="5%"><strong>{buildingSummaryData?.[0]?.sanitary_summary.drain_75_mm != null ? <>{Number((buildingSummaryData[0]).sanitary_summary.drain_75_mm)} <br /> stk</> : (<></>)}</strong></th>
                                                                                <th width="5%"><strong>{buildingSummaryData?.[0]?.sanitary_summary.drain_110_mm != null ? <>{Number((buildingSummaryData[0]).sanitary_summary.drain_110_mm)} <br /> stk</> : (<></>)}</strong></th>
                                                                            </tr>
                                                                        </tfoot>
                                                                    </table>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </>
                                                )
                                            }
                                        </>
                                    )
                                ) : (<></>)
                            }
                        </>
                    )
                }
            </div>
        </>
    );
}

export default SanitaryEquipment;
