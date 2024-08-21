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
//import BuildingSummary from './BuildingSummary';

function Heating() {
    const { projectId } = useParams();

    // Error messages from child component
    const [childMessage, setChildMessage] = useState('');

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
        }
    }

    return (
        <>
            {roomError && roomError.error && roomError.error !== null ? (<MessageBox message={roomError.error} />) : (<></>)}
            {buildingDataError && buildingDataError.error && buildingDataError.error !== null ? (<MessageBox message={buildingDataError.error} />) : (<></>)}
            <SubTitleComponent svg={<HeatingIcon />} headerText={"Varmetapsberegninger"} projectName={""} projectNumber={""} />
            <div className='main-content'>
                {
                    roomDataLoading && roomDataLoading === true ? (
                        <LoadingSpinner />
                    ) : (
                        <>
                            <div className="text-container-above-tables">
                                {activeSortButton !== null && activeSortButton !== "all" ? <ToggleSettingsButton onSettingsButtonUpdate={handleSettingsButtonUpdate} msgToParent={handleChildMessage} buildingUid={activeSortButton} /> : ''}
                                &nbsp;
                                {buildingData && buildingData.building_data && Object.keys(buildingData.building_data).map((key, index) => (
                                    <button key={index} name={buildingData.building_data[key].uid} onClick={sortButtonClick} className={activeSortButton === buildingData.building_data[key].uid ? `table-sorting-button-active` : `table-sorting-button`}>
                                        {buildingData.building_data[key].BuildingName}
                                    </button>
                                ))}
                            </div>
                            <TableTop />
                            <div className="table-wrapper">
                                <table className="fl-table">
                                    <thead>
                                        <tr>
                                            <th width="2%">#</th>
                                            <th width="2%">Etg</th>
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
                                            <th width="8%">Merknad</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            floors && floors.map(floor => (
                                                <React.Fragment key={floor}>
                                                    {
                                                        sortedBuildings && sortedBuildings.length > 0 ? (
                                                            sortedBuildings.filter(room => room.Floor === floor).map((room, index) => <HeatingTableRowComponent index={index} settingsUpdateState={settingsUpdatedState} msgToParent={handleChildMessage} totalColumns={15} key={room.uid} roomId={room.uid} />)
                                                        ) : (<></>)
                                                    }
                                                    <tr className="summary-row">
                                                        <td>
                                                            <br /><br />
                                                        </td>
                                                        <td></td>
                                                        <td></td>
                                                        <td></td>
                                                        <td></td>
                                                        <td></td>
                                                        <td></td>
                                                        <td></td>
                                                        <td></td>
                                                        <td></td>
                                                        <td>
                                                            {
                                                                buildingSummaryData && buildingSummaryData[0]?.floor_summaries_heating &&
                                                                Object.keys(buildingSummaryData[0].floor_summaries_heating)
                                                                    .filter(key => key === floor)
                                                                    .map(key => (
                                                                        <React.Fragment key={key}>
                                                                            <span className="heating-text">{Number(buildingSummaryData[0].floor_summaries_heating[key].demand.toFixed(0)).toLocaleString()}</span>
                                                                        </React.Fragment>
                                                                    ))
                                                            }
                                                        </td>
                                                        <td>
                                                            {
                                                                buildingSummaryData && buildingSummaryData[0]?.floor_summaries_heating &&
                                                                Object.keys(buildingSummaryData[0].floor_summaries_heating)
                                                                    .filter(key => key === floor)
                                                                    .map(key => (
                                                                        <React.Fragment key={key}>
                                                                            <span className="heating-text">{Number(buildingSummaryData[0].floor_summaries_heating[key].chosen.toFixed(0)).toLocaleString()}</span>
                                                                        </React.Fragment>
                                                                    ))
                                                            }
                                                        </td>
                                                        <td></td>
                                                        <td></td>
                                                        <td></td>
                                                    </tr>
                                                </React.Fragment>
                                            ))}
                                    </tbody>
                                    <tfoot>
                                        <tr>
                                            <th></th>
                                            <th></th>
                                            <th>
                                                Sum
                                            </th>
                                            <th></th>
                                            <th></th>
                                            <th></th>
                                            <th></th>
                                            <th></th>
                                            <th></th>
                                            <th></th>
                                            <th>
                                                <strong>
                                                    {buildingSummaryData?.[0]?.heatingDemand != null ? <><span className="heating-text">{((buildingSummaryData[0].heatingDemand) / 1000).toFixed(1)}</span> <br />kW</> : ''}
                                                </strong>
                                            </th>
                                            <th>
                                                <strong>
                                                    {buildingSummaryData?.[0]?.heating != null ? <><span className="heating-text">{((buildingSummaryData[0].heating) / 1000).toFixed(1)}</span> <br />kW</> : ''}
                                                </strong>
                                            </th>
                                            <th></th>
                                            <th></th>
                                            <th></th>

                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </>
                    )
                }

            </div>
        </>
    );
}

export default Heating;