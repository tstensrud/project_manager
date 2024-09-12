import React, { useState, useEffect } from 'react'
import { useLocation, useParams } from 'react-router-dom';

import useFetch from '../../hooks/useFetch'
import { customSortFloors } from '../../utils/customSortFloors.js'

import VentilationIcon from '../../assets/svg/ventilationIcon.jsx';
import SubTitleComponent from '../../layout/SubTitleComponent';
import VentilationTableRowComponent from "./VentilationTableRowComponent";
import MessageBox from '../../layout/MessageBox';
import TableTop from '../../layout/TableTop';
import LoadingSpinner from '../../layout/LoadingSpinner.jsx';
import HelpBox from './HelpBox.jsx';
import MainContentContainer from '../../layout/MainContentContainer.jsx';
import SortingButton from '../../layout/formelements/SortingButton.jsx';
import ActiveSortingButton from '../../layout/formelements/ActiveSortingButton.jsx'
import Table from '../../layout/tableelements/Table.jsx';
import TableTHelement from '../../layout/tableelements/TableTHelement.jsx';
import TableTDelement from "../../layout/tableelements/TableTDelement.jsx";

//import BuildingSummary from './BuildingSummary';

function Ventilation() {
    const { projectId } = useParams();
    const location = useLocation();

    // Initial fetch of data
    const { data: roomData, loading } = useFetch(`/project_api/${projectId}/rooms/`);
    const { data: buildingData, refetch: buildingReFetch } = useFetch(`/project_api/${projectId}/ventilation/buildings/`);
    const { data: ventSystemData } = useFetch(`/project_api/${projectId}/systems/`);

    // Error messages from child component
    const [childMessage, setChildMessage] = useState('');

    // Sorting
    const [sortedBuildings, setSortedBuildings] = useState(roomData?.room_data || []);
    const [buildingId, setBuildingId] = useState(null);
    const [activeSortButton, setActivesortButton] = useState(null);
    const [buildingSummaryData, setBuildingSummaryData] = useState(null);
    const [floors, setFloors] = useState([]);

    //console.log(buildingSummaryData)

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

            <SubTitleComponent svg={<VentilationIcon />} headerText={"Luftmengdetabeller"} projectName={""} projectNumber={""} />
            <MainContentContainer>

                {
                    loading && loading === true ? (
                        <div>
                            <LoadingSpinner />
                        </div>
                    ) : (
                        <>
                            <div className="flex flex-row w-full justify-center mt-5">
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
                                                    <>
                                                        <div className="w-full flex justify-center mt-12">
                                                            Velg bygg
                                                        </div>

                                                    </>
                                                ) : (
                                                    <>
                                                        <TableTop info={<HelpBox />} />
                                                        <div className="flex flex-col h-[80%] overflow-y-auto">
                                                            <div className="sticky ml-5 mr-5 mt-0 top-0 rounded-bl-lg rounded-br-lg bg-secondary-color z-10">
                                                                <Table>
                                                                    <thead>
                                                                        <tr>
                                                                            <TableTHelement width="2%" text="#" />
                                                                            <TableTHelement width="10%" text="Rom" />
                                                                            <TableTHelement width="6%">Sum personer<br />m³/h</TableTHelement>
                                                                            <TableTHelement width="6%">Sum emisjon<br /> m³/h</TableTHelement>
                                                                            <TableTHelement width="6%">Prosess <br />m³/h </TableTHelement>
                                                                            <TableTHelement width="6%">Dimensjonert<br /> m³/h</TableTHelement>
                                                                            <TableTHelement width="6%">Tilluft<br /> m³/h</TableTHelement>
                                                                            <TableTHelement width="6%">Avtrekk<br /> m³/h</TableTHelement>
                                                                            <TableTHelement width="6%">m³/m²</TableTHelement>
                                                                            <TableTHelement width="6%">Min m³/h</TableTHelement>
                                                                            <TableTHelement width="6%" text="System" />
                                                                            <TableTHelement width="34%" text="Merknad" />
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
                                                                                            sortedBuildings.filter(room => room.Floor === floor).map((room, index) => <VentilationTableRowComponent index={index} buildingReFetch={buildingReFetch} key={room.uid} allRoomData={room} totalColumns={12} roomId={room.uid} systems={ventSystemData} />)
                                                                                        ) : (<></>)
                                                                                    }
                                                                                    <tr className="bg-secondary-color">
                                                                                        <TableTDelement width="2%" />
                                                                                        <TableTDelement width="10%" />
                                                                                        <TableTDelement width="6%" />
                                                                                        <TableTDelement width="6%" />
                                                                                        <TableTDelement width="6%" />
                                                                                        <TableTDelement width="6%">
                                                                                            {
                                                                                                buildingSummaryData && buildingSummaryData[0]?.floor_summaries &&
                                                                                                Object.keys(buildingSummaryData[0].floor_summaries)
                                                                                                    .filter(key => key === floor)
                                                                                                    .map(key => (
                                                                                                        <React.Fragment key={key}>
                                                                                                            <span className="font-bold">
                                                                                                                {Number(buildingSummaryData[0].floor_summaries[key].demand.toFixed(0)).toLocaleString()}
                                                                                                                <br /> m<sup>3</sup>/h
                                                                                                            </span>
                                                                                                        </React.Fragment>
                                                                                                    ))
                                                                                            }

                                                                                        </TableTDelement>
                                                                                        <TableTDelement width="6%">
                                                                                            {
                                                                                                buildingSummaryData && buildingSummaryData[0]?.floor_summaries &&
                                                                                                Object.keys(buildingSummaryData[0].floor_summaries)
                                                                                                    .filter(key => key === floor)
                                                                                                    .map(key => (
                                                                                                        <React.Fragment key={key}>
                                                                                                            <span className="text-supply-color font-bold">
                                                                                                                    {Number(buildingSummaryData[0].floor_summaries[key].supply.toFixed(0)).toLocaleString()}
                                                                                                                    <br /> m<sup>3</sup>/h
                                                                                                            </span>
                                                                                                        </React.Fragment>
                                                                                                    ))
                                                                                            }
                                                                                        </TableTDelement>
                                                                                        <TableTDelement width="6%">
                                                                                            {
                                                                                                buildingSummaryData && buildingSummaryData[0]?.floor_summaries &&
                                                                                                Object.keys(buildingSummaryData[0].floor_summaries)
                                                                                                    .filter(key => key === floor)
                                                                                                    .map(key => (
                                                                                                        <React.Fragment key={key}>
                                                                                                            <span className="text-extract-color font-bold">
                                                                                                                {Number(buildingSummaryData[0].floor_summaries[key].extract.toFixed(0)).toLocaleString()}
                                                                                                                <br /> m<sup>3</sup>/h
                                                                                                            </span>
                                                                                                        </React.Fragment>
                                                                                                    ))
                                                                                            }

                                                                                        </TableTDelement>
                                                                                        <TableTDelement width="6%" />
                                                                                        <TableTDelement width="6%" />
                                                                                        <TableTDelement width="6%" />
                                                                                        <TableTDelement width="34%">
                                                                                        {
                                                                                                buildingSummaryData && buildingSummaryData[0]?.floor_summaries &&
                                                                                                Object.keys(buildingSummaryData[0].floor_summaries)
                                                                                                    .filter(key => key === floor)
                                                                                                    .map(key => (
                                                                                                        <React.Fragment key={key}>
                                                                                                            <div className="font-semibold">
                                                                                                            {buildingSummaryData[0].floor_summaries[key].supply < buildingSummaryData[0].floor_summaries[key].demand && 'For lite luftmengde ift dimensjonert. '}
                                                                                                            {buildingSummaryData[0].floor_summaries[key].supply !== buildingSummaryData[0].floor_summaries[key].extract && 'Ubalanse i etasje.'}
                                                                                                            </div>
                                                                                                        </React.Fragment>
                                                                                                    ))
                                                                                            }    
                                                                                        </TableTDelement>
                                                                                    </tr>
                                                                                </tbody>
                                                                            </Table>
                                                                        </div>
                                                                    </React.Fragment>
                                                                ))
                                                            }

                                                            <div className="flex flex-col ml-5 mr-5 mt-0 h-auto rounded-bl-lg rounded-br-lg bg-secondary-color shadow-lg shadow-background-shade mb-5">
                                                                <Table>
                                                                    <tbody>
                                                                        <tr>
                                                                            <TableTDelement width="2%" />
                                                                            <TableTDelement width="10%">
                                                                                <strong>Sum</strong>
                                                                            </TableTDelement>
                                                                            <TableTDelement width="6%" />
                                                                            <TableTDelement width="6%" />
                                                                            <TableTDelement width="6%" />

                                                                            <TableTDelement width="6%">
                                                                                <strong>{buildingSummaryData?.[0]?.demand != null ? <>{Number((buildingSummaryData[0]).demand.toFixed(0)).toLocaleString()} <br /> m<sup>3</sup>/h</> : (<></>)}</strong>
                                                                            </TableTDelement>
                                                                            <TableTDelement width="6%">
                                                                                <strong>{buildingSummaryData?.[0]?.supplyAir != null ? <>{Number((buildingSummaryData[0].supplyAir).toFixed(0)).toLocaleString()} <br /> m<sup>3</sup>/h</> : (<></>)}</strong>
                                                                            </TableTDelement>
                                                                            <TableTDelement width="6%">
                                                                                <strong>{buildingSummaryData?.[0]?.extractAir ? <>{Number((buildingSummaryData[0].extractAir).toFixed(0)).toLocaleString()} <br /> m<sup>3</sup>/h</> : (<></>)}</strong>
                                                                            </TableTDelement>
                                                                            <TableTDelement width="6%" />
                                                                            <TableTDelement width="6%" />
                                                                            <TableTDelement width="6%" />
                                                                            <TableTDelement width="34%" />
                                                                        </tr>
                                                                    </tbody>
                                                                </Table>
                                                            </div>
                                                        </div>
                                                    </>
                                                )
                                            }
                                        </>
                                    )
                                ) : (<span></span>)
                            }
                        </>
                    )
                }
            </MainContentContainer>
        </>
    );
}

export default Ventilation;
