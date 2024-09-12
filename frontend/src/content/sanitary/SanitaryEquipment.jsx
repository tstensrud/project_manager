import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

import useFetch from '../../hooks/useFetch.jsx'
import { customSortFloors } from '../../utils/customSortFloors.js'

import TapwaterIcon from '../../assets/svg/tapWaterIcon.jsx';
import SubTitleComponent from '../../layout/SubTitleComponent.jsx';
import SanitaryTableRowComponent from "./SanitaryTableRowComponent.jsx";
import MessageBox from '../../layout/MessageBox.jsx';
import TableTop from '../../layout/TableTop.jsx';
import LoadingSpinner from '../../layout/LoadingSpinner.jsx';
import HelpBox from './HelpBox.jsx';
import MainContentContainer from '../../layout/MainContentContainer.jsx';
import SortingButton from '../../layout/formelements/SortingButton.jsx';
import ActiveSortingButton from '../../layout/formelements/ActiveSortingButton.jsx'
import Table from '../../layout/tableelements/Table.jsx';
import TableTHelement from '../../layout/tableelements/TableTHelement.jsx';
import TableTDelement from "../../layout/tableelements/TableTDelement.jsx";

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
        setSortedBuildings(roomData?.room_data && roomData.room_data.filter((room) => room.BuildingUid === buildingId));
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
            <MainContentContainer>
                {
                    roomDataLoading === true ? (
                        <LoadingSpinner />
                    ) : (
                        <>
                            <div className="overflow-y-hidden flex justify-center items-center mr-5 ml-5 h-32 no-print">
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
                                roomData ? (
                                    roomData.room_data === null ? (
                                        <div className="w-full flex justify-center mt-12">
                                            Ingen rom lagt til
                                        </div>
                                    ) : (
                                        <>
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
                                                                            <TableTHelement width="12%">Rom</TableTHelement>
                                                                            <TableTHelement width="5%">Sjakt</TableTHelement>
                                                                            <TableTHelement width="5%">1/14" servant</TableTHelement>
                                                                            <TableTHelement width="5%">1" servant</TableTHelement>
                                                                            <TableTHelement width="5%">Drikkefontene</TableTHelement>
                                                                            <TableTHelement width="5%">Utslagsvask</TableTHelement>
                                                                            <TableTHelement width="5%">WC</TableTHelement>
                                                                            <TableTHelement width="5%">Urinal</TableTHelement>
                                                                            <TableTHelement width="5%">Oppvaskmaskin</TableTHelement>
                                                                            <TableTHelement width="5%">Dusjbatteri</TableTHelement>
                                                                            <TableTHelement width="5%">Badekar</TableTHelement>
                                                                            <TableTHelement width="5%">Vaskemaskin</TableTHelement>
                                                                            <TableTHelement width="5%">Tappekran <br />inne</TableTHelement>
                                                                            <TableTHelement width="5%">Tappekran <br />ute</TableTHelement>
                                                                            <TableTHelement width="5%">Brannskap</TableTHelement>
                                                                            <TableTHelement width="5%">Sluk<br />75mm</TableTHelement>
                                                                            <TableTHelement width="5%">Sluk<br />110mm</TableTHelement>
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
                                                                                        sortedBuildings && sortedBuildings.length > 0 ? (
                                                                                            sortedBuildings.filter(room => room.Floor === floor).map((room, index) => <SanitaryTableRowComponent index={index} buildingReFetch={buildingReFetch} key={room.uid} allRoomData={room} totalColumns={18} roomId={room.uid} />)
                                                                                        ) : (<></>)
                                                                                    }
                                                                                    <tr className="bg-secondary-color">
                                                                                        <TableTDelement width="2%" />
                                                                                        <TableTDelement width="12%" />
                                                                                        <TableTDelement width="5%" />
                                                                                        <TableTDelement width="5%" />
                                                                                        <TableTDelement width="5%" />
                                                                                        <TableTDelement width="5%">
                                                                                            {
                                                                                                buildingSummaryData && buildingSummaryData[0]?.floor_summaries &&
                                                                                                Object.keys(buildingSummaryData[0].floor_summaries)
                                                                                                    .filter(key => key === floor)
                                                                                                    .map(key => (
                                                                                                        <React.Fragment key={key}>

                                                                                                        </React.Fragment>
                                                                                                    ))
                                                                                            }

                                                                                        </TableTDelement>
                                                                                        <TableTDelement width="5%">
                                                                                            {
                                                                                                buildingSummaryData && buildingSummaryData[0]?.floor_summaries &&
                                                                                                Object.keys(buildingSummaryData[0].floor_summaries)
                                                                                                    .filter(key => key === floor)
                                                                                                    .map(key => (
                                                                                                        <React.Fragment key={key}>

                                                                                                        </React.Fragment>
                                                                                                    ))
                                                                                            }
                                                                                        </TableTDelement>
                                                                                        <TableTDelement width="5%">
                                                                                            {
                                                                                                buildingSummaryData && buildingSummaryData[0]?.floor_summaries &&
                                                                                                Object.keys(buildingSummaryData[0].floor_summaries)
                                                                                                    .filter(key => key === floor)
                                                                                                    .map(key => (
                                                                                                        <React.Fragment key={key}>

                                                                                                        </React.Fragment>
                                                                                                    ))
                                                                                            }
                                                                                        </TableTDelement>
                                                                                        <TableTDelement width="5%" />
                                                                                        <TableTDelement width="5%" />
                                                                                        <TableTDelement width="5%" />
                                                                                        <TableTDelement width="5%" />
                                                                                        <TableTDelement width="5%" />
                                                                                        <TableTDelement width="5%" />
                                                                                        <TableTDelement width="5%" />
                                                                                        <TableTDelement width="5%" />
                                                                                        <TableTDelement width="5%" />
                                                                                        <TableTDelement width="5%" />
                                                                                    </tr>
                                                                                </tbody>
                                                                            </Table>
                                                                        </div>
                                                                    </React.Fragment>
                                                                ))}
                                                            <div style={{ marginBottom: "30px" }}>
                                                                <div className="flex flex-col ml-5 mr-5 mt-0 h-auto rounded-bl-lg rounded-br-lg bg-secondary-color shadow-lg shadow-background-shade mb-5">
                                                                    <Table>
                                                                        <tfoot>
                                                                            <tr>
                                                                                <TableTDelement width="2%" />
                                                                                <TableTDelement width="12%" />
                                                                                <TableTDelement width="5%" />
                                                                                <TableTDelement width="5%"><strong>{buildingSummaryData && buildingSummaryData?.[0]?.sanitary_summary.sink_1_14_inch != null ? <>{Number((buildingSummaryData[0]).sanitary_summary.sink_1_14_inch)} <br /> stk</> : (<></>)}</strong></TableTDelement>
                                                                                <TableTDelement width="5%"><strong>{buildingSummaryData?.[0]?.sanitary_summary.sink_large != null ? <>{Number((buildingSummaryData[0]).sanitary_summary.sink_large)} <br /> stk</> : (<></>)}</strong></TableTDelement>
                                                                                <TableTDelement width="5%"><strong>{buildingSummaryData?.[0]?.sanitary_summary.drinking_fountain != null ? <>{Number((buildingSummaryData[0]).sanitary_summary.drinking_fountain)} <br /> stk</> : (<></>)}</strong></TableTDelement>
                                                                                <TableTDelement width="5%"><strong>{buildingSummaryData?.[0]?.sanitary_summary.sink_utility != null ? <>{Number((buildingSummaryData[0]).sanitary_summary.sink_utility)} <br /> stk</> : (<></>)}</strong></TableTDelement>
                                                                                <TableTDelement width="5%"><strong>{buildingSummaryData?.[0]?.sanitary_summary.wc != null ? <>{Number((buildingSummaryData[0]).sanitary_summary.wc)} <br /> stk</> : (<></>)}</strong></TableTDelement>
                                                                                <TableTDelement width="5%"><strong>{buildingSummaryData?.[0]?.sanitary_summary.urinal != null ? <>{Number((buildingSummaryData[0]).sanitary_summary.urinal)} <br /> stk</> : (<></>)}</strong></TableTDelement>
                                                                                <TableTDelement width="5%"><strong>{buildingSummaryData?.[0]?.sanitary_summary.dishwasher != null ? <>{Number((buildingSummaryData[0]).sanitary_summary.dishwasher)} <br /> stk</> : (<></>)}</strong></TableTDelement>
                                                                                <TableTDelement width="5%"><strong>{buildingSummaryData?.[0]?.sanitary_summary.shower != null ? <>{Number((buildingSummaryData[0]).sanitary_summary.shower)} <br /> stk</> : (<></>)}</strong></TableTDelement>
                                                                                <TableTDelement width="5%"><strong>{buildingSummaryData?.[0]?.sanitary_summary.tub != null ? <>{Number((buildingSummaryData[0]).sanitary_summary.tub)} <br /> stk</> : (<></>)}</strong></TableTDelement>
                                                                                <TableTDelement width="5%"><strong>{buildingSummaryData?.[0]?.sanitary_summary.washing_machine != null ? <>{Number((buildingSummaryData[0]).sanitary_summary.washing_machine)} <br /> stk</> : (<></>)}</strong></TableTDelement>
                                                                                <TableTDelement width="5%"><strong>{buildingSummaryData?.[0]?.sanitary_summary.tap_water_outlet_inside != null ? <>{Number((buildingSummaryData[0]).sanitary_summary.tap_water_outlet_inside)} <br /> stk</> : (<></>)}</strong></TableTDelement>
                                                                                <TableTDelement width="5%"><strong>{buildingSummaryData?.[0]?.sanitary_summary.tap_water_outlet_outside != null ? <>{Number((buildingSummaryData[0]).sanitary_summary.tap_water_outlet_outside)} <br /> stk</> : (<></>)}</strong></TableTDelement>
                                                                                <TableTDelement width="5%"><strong>{buildingSummaryData?.[0]?.sanitary_summary.firehose != null ? <>{Number((buildingSummaryData[0]).sanitary_summary.firehose)} <br /> stk</> : (<></>)}</strong></TableTDelement>
                                                                                <TableTDelement width="5%"><strong>{buildingSummaryData?.[0]?.sanitary_summary.drain_75_mm != null ? <>{Number((buildingSummaryData[0]).sanitary_summary.drain_75_mm)} <br /> stk</> : (<></>)}</strong></TableTDelement>
                                                                                <TableTDelement width="5%"><strong>{buildingSummaryData?.[0]?.sanitary_summary.drain_110_mm != null ? <>{Number((buildingSummaryData[0]).sanitary_summary.drain_110_mm)} <br /> stk</> : (<></>)}</strong></TableTDelement>
                                                                            </tr>
                                                                        </tfoot>
                                                                    </Table>
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
            </MainContentContainer>
        </>
    );
}

export default SanitaryEquipment;
