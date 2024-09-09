import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';

import useFetch from '../../hooks/useFetch'
import { customSortFloors } from '../../utils/customSortFloors.js'

import HeatingIcon from '../../assets/svg/heatingIcon.svg?react'
import SubTitleComponent from '../../layout/SubTitleComponent';
import HeatingTableRowComponent from './HeatingTableRowComponent';
import MessageBox from '../../layout/MessageBox';
import ToggleSettingsButton from './ToggleSettingsButton';
import TableTop from '../../layout/TableTop.jsx';
import LoadingSpinner from '../../layout/LoadingSpinner.jsx';
import HelpBox from './HelpBox.jsx';
//import BuildingSummary from './BuildingSummary';

function Heating() {
    const { projectId } = useParams();

    // Fetches
    const { data: roomData, loading: roomDataLoading, error: roomError, refetch: roomRefetch } = useFetch(`/project_api/${projectId}/rooms/`);
    const { data: buildingData, error: buildingDataError, refetch: buildingReFetch } = useFetch(`/project_api/${projectId}/heating/buildings/`);

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
        const filteredBuildingData = buildingData && buildingData.building_data
            ? buildingData.building_data.filter((building) => building.uid === activeSortButton)
            : null;
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
        buildingReFetch();
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
            {buildingDataError?.error && buildingDataError.error !== null ? (<MessageBox message={buildingDataError.error} />) : (<></>)}
            <SubTitleComponent svg={<HeatingIcon />} headerText={"Varmetapsberegninger"} projectName={""} projectNumber={""} />
            <div className='main-content'>
                {
                    roomDataLoading && roomDataLoading === true ? (
                        <LoadingSpinner />
                    ) : (
                        <>
                            <div className="text-container-above-tables">
                                {activeSortButton !== null && activeSortButton !== "all" ? <ToggleSettingsButton onSettingsButtonUpdate={handleSettingsButtonUpdate} buildingUid={activeSortButton} /> : ''}
                                &nbsp;
                                {buildingData && buildingData.building_data && Object.keys(buildingData.building_data).map((key, index) => (
                                    <button key={index} name={buildingData.building_data[key].uid} onClick={sortButtonClick} className={activeSortButton === buildingData.building_data[key].uid ? `table-sorting-button-active` : `table-sorting-button`}>
                                        {buildingData.building_data[key].BuildingName}
                                    </button>
                                ))}
                            </div>
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
                                                            <th width="5%">Romnr</th>
                                                            <th width="5%">Høyde <br />m</th>
                                                            <th width="5%">Yttervegg <br /> m<sup>2</sup></th>
                                                            <th width="5%">Innervegg <br />m<sup>2</sup></th>
                                                            <th width="5%">Vindu/dør <br />m<sup>2</sup></th>
                                                            <th width="5%">Tak <br />m<sup>2</sup></th>
                                                            <th width="5%">Gulv grunn <br />m<sup>2</sup></th>
                                                            <th width="5%">Gulv fritt <br />m<sup>2</sup></th>
                                                            <th width="5%">&#8721; varmetap<br /> W</th>
                                                            <th width="5%">Valgt varme<br /> W</th>
                                                            <th width="5%">W/m<sup>2</sup></th>
                                                            <th width="8%">Varmekilde</th>
                                                            <th width="10%">Merknad</th>
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
                                                            <table className="fl-table" id="roomsTableVentilation">
                                                                <tbody>
                                                                    <tr>
                                                                        <td style={{ border: "0px" }} width="2%"></td>
                                                                        <td style={{ border: "0px" }} width="5%"></td>
                                                                        <td style={{ border: "0px" }} width="5%"></td>
                                                                        <td style={{ border: "0px" }} width="5%"></td>
                                                                        <td style={{ border: "0px" }} width="5%"></td>
                                                                        <td style={{ border: "0px" }} width="5%"></td>
                                                                        <td style={{ border: "0px" }} width="5%"></td>
                                                                        <td style={{ border: "0px" }} width="5%"></td>
                                                                        <td style={{ border: "0px" }} width="5%"></td>
                                                                        <td style={{ border: "0px" }} width="5%"></td>
                                                                        <td style={{ border: "0px" }} width="5%"></td>
                                                                        <td style={{ border: "0px" }} width="5%"></td>
                                                                        <td style={{ border: "0px" }} width="8%"></td>
                                                                        <td style={{ border: "0px" }} width="10%"></td>
                                                                    </tr>
                                                                    {
                                                                        sortedBuildings && sortedBuildings.length > 0 ? (
                                                                            sortedBuildings.filter(room => room.Floor === floor).map((room, index) => <HeatingTableRowComponent index={index} buildingReFetch={buildingReFetch} settingsUpdateState={settingsUpdatedState} totalColumns={14} key={room.uid} roomId={room.uid} />)
                                                                        ) : (<></>)
                                                                    }

                                                                    <tr className="summary-row">
                                                                        <td width="2%">
                                                                            <br /><br />
                                                                        </td>
                                                                        {/* <td width="2%"></td> */}
                                                                        <td width="5%"></td>
                                                                        <td width="5%"></td>
                                                                        <td width="5%"></td>
                                                                        <td width="5%"></td>
                                                                        <td width="5%"></td>
                                                                        <td width="5%"></td>
                                                                        <td width="5%"></td>
                                                                        <td width="5%"></td>
                                                                        <td width="5%">
                                                                            {
                                                                                buildingSummaryData && buildingSummaryData[0]?.floor_summaries_heating &&
                                                                                Object.keys(buildingSummaryData[0].floor_summaries_heating)
                                                                                    .filter(key => key === floor)
                                                                                    .map(key => (
                                                                                        <React.Fragment key={key}>
                                                                                            <span className="heating-text"><strong>{Number(buildingSummaryData[0].floor_summaries_heating[key].demand.toFixed(0)).toLocaleString()}</strong></span>
                                                                                        </React.Fragment>
                                                                                    ))
                                                                            }
                                                                        </td>
                                                                        <td width="5%">
                                                                            {
                                                                                buildingSummaryData && buildingSummaryData[0]?.floor_summaries_heating &&
                                                                                Object.keys(buildingSummaryData[0].floor_summaries_heating)
                                                                                    .filter(key => key === floor)
                                                                                    .map(key => (
                                                                                        <React.Fragment key={key}>
                                                                                            <span className="heating-text"><strong>{Number(buildingSummaryData[0].floor_summaries_heating[key].chosen.toFixed(0)).toLocaleString()}</strong></span>
                                                                                        </React.Fragment>
                                                                                    ))
                                                                            }
                                                                        </td>
                                                                        <td width="5%"></td>
                                                                        <td width="8%"></td>
                                                                        <td width="10%"></td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </React.Fragment>
                                                ))}
                                            <div className="table-wrapper">
                                                <table className="fl-table">
                                                    <tfoot>
                                                        <tr>
                                                            <td width="2%"></td>
                                                            {/* <td width="2%"></td> */}
                                                            <td width="5%">
                                                                Sum
                                                            </td>
                                                            <td width="5%"></td>
                                                            <td width="5%"></td>
                                                            <td width="5%"></td>
                                                            <td width="5%"></td>
                                                            <td width="5%"></td>
                                                            <td width="5%"></td>
                                                            <td width="5%"></td>
                                                            <td width="5%">
                                                                <strong>
                                                                    {buildingSummaryData?.[0]?.heatingDemand != null ? <><span className="heating-text">{((buildingSummaryData[0].heatingDemand) / 1000).toFixed(1)}</span> <br />kW</> : ''}
                                                                </strong>
                                                            </td>
                                                            <td width="5%">
                                                                <strong>
                                                                    {buildingSummaryData?.[0]?.heating != null ? <><span className="heating-text">{((buildingSummaryData[0].heating) / 1000).toFixed(1)}</span> <br />kW</> : ''}
                                                                </strong>
                                                            </td>
                                                            <td width="5%"></td>
                                                            <td width="8%"></td>
                                                            <td width="8%"></td>

                                                        </tr>
                                                    </tfoot>
                                                </table>
                                            </div>
                                        </div>
                                    </>
                                )
                            }
                        </>
                    )
                }
            </div >
        </>
    );
}

export default Heating;