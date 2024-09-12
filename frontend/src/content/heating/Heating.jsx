import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';

// Hooks and utils
import useFetch from '../../hooks/useFetch'
import { customSortFloors } from '../../utils/customSortFloors.js'

// Components
import HeatingIcon from '../../assets/svg/heatingIcon.jsx'
import SubTitleComponent from '../../layout/SubTitleComponent';
import HeatingTableRowComponent from './HeatingTableRowComponent';
import MessageBox from '../../layout/MessageBox';
import ToggleSettingsButton from './ToggleSettingsButton';
import TableTop from '../../layout/TableTop.jsx';
import LoadingSpinner from '../../layout/LoadingSpinner.jsx';
import HelpBox from './HelpBox.jsx';
import MainContentContainer from '../../layout/MainContentContainer.jsx';
import SortingButton from '../../layout/formelements/SortingButton.jsx';
import ActiveSortingButton from '../../layout/formelements/ActiveSortingButton.jsx'
import Table from '../../layout/tableelements/Table.jsx';
import TableTHelement from '../../layout/tableelements/TableTHelement.jsx';
import TableTDelement from "../../layout/tableelements/TableTDelement.jsx";

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
            {roomError?.error && roomError.error !== null && (<MessageBox message={roomError.error} />)}
            {buildingDataError?.error && buildingDataError.error !== null && (<MessageBox message={buildingDataError.error} />)}
            <SubTitleComponent svg={<HeatingIcon />} headerText={"Varmetapsberegninger"} projectName={""} projectNumber={""} />
            <MainContentContainer>
                {
                    roomDataLoading && roomDataLoading === true ? (
                        <LoadingSpinner />
                    ) : (
                        <>
                            <div className="overflow-y-hidden flex justify-center items-center mr-5 ml-5 h-32">
                                {
                                    activeSortButton !== null && activeSortButton !== "all" &&
                                    <ToggleSettingsButton onSettingsButtonUpdate={handleSettingsButtonUpdate} buildingUid={activeSortButton} />
                                }
                                {
                                    buildingData?.building_data && Object.keys(buildingData.building_data).map((key, index) => (
                                        <div key={index}>
                                            {
                                                activeSortButton === buildingData.building_data[key].uid ? (
                                                    <SortingButton name={buildingData.building_data[key].uid} buttonText={buildingData.building_data[key].BuildingName} sortButtonClick={sortButtonClick} />
                                                ) : (
                                                    <ActiveSortingButton name={buildingData.building_data[key].uid} buttonText={buildingData.building_data[key].BuildingName} sortButtonClick={sortButtonClick} />
                                                )
                                            }
                                        </div>
                                    ))
                                }
                            </div>
                            {
                                activeSortButton === null ? (
                                    <div className="w-full flex justify-center mt-12">
                                        Velg bygg
                                    </div>
                                ) : (
                                    <>
                                        <TableTop info={<HelpBox />} />
                                        <div className="flex flex-col h-[80%] overflow-y-auto">
                                            <div className="sticky ml-5 mr-5 mt-0 top-0 rounded-bl-lg rounded-br-lg bg-secondary-color z-10">
                                                <Table>
                                                    <thead>
                                                        <tr>
                                                            <TableTHelement width="2%" text="#" />
                                                            <TableTHelement width="5%">Romnr</TableTHelement>
                                                            <TableTHelement width="5%">Høyde <br />m</TableTHelement>
                                                            <TableTHelement width="5%">Yttervegg <br /> m<sup>2</sup></TableTHelement>
                                                            <TableTHelement width="5%">Innervegg <br />m<sup>2</sup></TableTHelement>
                                                            <TableTHelement width="5%">Vindu/dør <br />m<sup>2</sup></TableTHelement>
                                                            <TableTHelement width="5%">Tak <br />m<sup>2</sup></TableTHelement>
                                                            <TableTHelement width="5%">Gulv grunn <br />m<sup>2</sup></TableTHelement>
                                                            <TableTHelement width="5%">Gulv fritt <br />m<sup>2</sup></TableTHelement>
                                                            <TableTHelement width="5%">&#8721; varmetap<br /> W</TableTHelement>
                                                            <TableTHelement width="5%">Valgt varme<br /> W</TableTHelement>
                                                            <TableTHelement width="5%">W/m<sup>2</sup></TableTHelement>
                                                            <TableTHelement width="8%">Varmekilde</TableTHelement>
                                                            <TableTHelement width="10%">Merknad</TableTHelement>
                                                        </tr>
                                                    </thead>
                                                </Table>
                                            </div>

                                            {
                                                floors && floors.map(floor => (
                                                    <React.Fragment key={floor}>
                                                        <div className="flex flex-col ml-5 mr-5 mt-0 h-auto rounded-bl-lg rounded-br-lg bg-secondary-color shadow-lg shadow-background-shade mb-5">
                                                            <div className="text-primary-color text-xs border-none w-full max-w-full bg-secondary-color flex justify-center">
                                                                <h3>Etasje {floor}</h3>
                                                            </div>
                                                            <Table>
                                                                <tbody>

                                                                    {
                                                                        sortedBuildings && sortedBuildings.length > 0 && (
                                                                            sortedBuildings.filter(room => room.Floor === floor).map((room, index) => <HeatingTableRowComponent index={index} buildingReFetch={buildingReFetch} settingsUpdateState={settingsUpdatedState} totalColumns={14} key={room.uid} roomId={room.uid} />)
                                                                        )
                                                                    }

                                                                    <tr className="bg-secondary-color">
                                                                        <TableTDelement width="2%" />
                                                                        <TableTDelement width="5%" />
                                                                        <TableTDelement width="5%" />
                                                                        <TableTDelement width="5%" />
                                                                        <TableTDelement width="5%" />
                                                                        <TableTDelement width="5%" />
                                                                        <TableTDelement width="5%" />
                                                                        <TableTDelement width="5%" />
                                                                        <TableTDelement width="5%" />
                                                                        <TableTDelement width="5%">
                                                                            {
                                                                                buildingSummaryData && buildingSummaryData[0]?.floor_summaries_heating &&
                                                                                Object.keys(buildingSummaryData[0].floor_summaries_heating)
                                                                                    .filter(key => key === floor)
                                                                                    .map(key => (
                                                                                        <React.Fragment key={key}>
                                                                                            <span className="text-heating-color"><strong>{Number(buildingSummaryData[0].floor_summaries_heating[key].demand.toFixed(0)).toLocaleString()}<br />W</strong></span>
                                                                                        </React.Fragment>
                                                                                    ))
                                                                            }
                                                                        </TableTDelement>
                                                                        <TableTDelement width="5%">
                                                                            {
                                                                                buildingSummaryData && buildingSummaryData[0]?.floor_summaries_heating &&
                                                                                Object.keys(buildingSummaryData[0].floor_summaries_heating)
                                                                                    .filter(key => key === floor)
                                                                                    .map(key => (
                                                                                        <React.Fragment key={key}>
                                                                                            <span className="text-heating-color"><strong>{Number(buildingSummaryData[0].floor_summaries_heating[key].chosen.toFixed(0)).toLocaleString()}<br />W</strong></span>
                                                                                        </React.Fragment>
                                                                                    ))
                                                                            }
                                                                        </TableTDelement>
                                                                        <TableTDelement width="5%" />
                                                                        <TableTDelement width="8%" />
                                                                        <TableTDelement width="10%" />
                                                                    </tr>
                                                                </tbody>
                                                            </Table>
                                                        </div>
                                                    </React.Fragment>
                                                ))
                                            }
                                            <div className="flex flex-col ml-5 mr-5 mt-0 h-auto rounded-bl-lg rounded-br-lg bg-secondary-color shadow-lg shadow-background-shade mb-5">
                                                <Table>
                                                    <tfoot>
                                                        <tr>
                                                            <TableTDelement width="2%" />
                                                            <TableTDelement width="5%">
                                                                Sum
                                                            </TableTDelement>
                                                            <TableTDelement width="5%" />
                                                            <TableTDelement width="5%" />
                                                            <TableTDelement width="5%" />
                                                            <TableTDelement width="5%" />
                                                            <TableTDelement width="5%" />
                                                            <TableTDelement width="5%" />
                                                            <TableTDelement width="5%" />
                                                            <TableTDelement width="5%">
                                                                <strong>
                                                                    {buildingSummaryData?.[0]?.heatingDemand != null ? <><span className="text-heating-color">{((buildingSummaryData[0].heatingDemand) / 1000).toFixed(1)}</span> <br />kW</> : ''}
                                                                </strong>
                                                            </TableTDelement>
                                                            <TableTDelement width="5%">
                                                                <strong>
                                                                    {buildingSummaryData?.[0]?.heating != null ? <><span className="text-heating-color">{((buildingSummaryData[0].heating) / 1000).toFixed(1)}</span> <br />kW</> : ''}
                                                                </strong>
                                                            </TableTDelement>
                                                            <TableTDelement width="5%" />
                                                            <TableTDelement width="8%" />
                                                            <TableTDelement width="10%" />
                                                        </tr>
                                                    </tfoot>
                                                </Table>
                                            </div>
                                        </div>
                                    </>
                                )
                            }
                        </>
                    )
                }
            </MainContentContainer>
        </>
    );
}

export default Heating;