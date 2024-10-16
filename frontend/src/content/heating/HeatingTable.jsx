import React, { useEffect, useState } from 'react';

// Hooks and utils
import useFetch from '../../hooks/useFetch'
import { customSortFloors } from '../../utils/customSortFloors.js'

//Components
import TableHeader from '../../layout/tableelements/TableHeader.jsx';
import TableTHelement from '../../layout/tableelements/TableTHelement.jsx';
import TableTDelement from "../../layout/tableelements/TableTDelement.jsx";
import TableTDFooter from "../../layout/tableelements/TableTDFooter.jsx";
import TableFooter from '../../layout/tableelements/TableFooter.jsx'
import TableContainer from '../../layout/tableelements/TableContainer.jsx';
import TableWrapper from "../../layout/tableelements/TableWrapper.jsx";
import HeatingTableRowComponent from "./HeatingTableRowComponent";
import TableTop from '../../layout/TableTop.jsx';
import LoadingSpinner from '../../layout/LoadingSpinner.jsx';
import MessageBox from '../../layout/MessageBox.jsx';

// help
import { title, sections } from '../help/HeatingTableHelp.jsx'
import { ERROR_FALLBACK_MSG } from '../../utils/globals.js';

function HeatingTable({ projectId, buildingUid, settingsUpdatedState }) {
    const { data: roomData, loading: roomDataLoading, error: roomDataError } = useFetch(`/project_api/${projectId}/rooms/building/${buildingUid}/`);
    const { data: buildingData, error: buildngDataError, refetch: buildingReFetch } = useFetch(`/project_api/${projectId}/heating/building_data/${buildingUid}/`);

    const [floors, setFloors] = useState([]);
    const [collapseAll, setCollapseAll] = useState(true);
    const [currentSettingsCounter, setCurrentSettingsCounter] = useState(0);

    useEffect(() => {
        if (buildingData?.success === true) {
            const floorSummaryKeys = Object.keys(buildingData?.data?.floor_summaries_heating);
            const sortedKeys = customSortFloors(floorSummaryKeys);
            setFloors(sortedKeys);
        }
    }, [buildingData]);

    useEffect(() => {
        if (settingsUpdatedState > currentSettingsCounter) {
            buildingReFetch();
            setCurrentSettingsCounter(prevCounter => prevCounter + 1);
        }
    }, [settingsUpdatedState]);

    return (
        <>
            {
                roomDataLoading ? (
                    <LoadingSpinner text="rom" />
                ) : (
                    <>
                        {
                            roomDataError || buildngDataError ? (
                                <>
                                    <MessageBox message={`${`${roomDataError}.` && roomDataError} ${buildngDataError && buildngDataError}`} closeable={false} />
                                </>
                            ) : (
                                <>
                                    {
                                        roomData?.success ? (
                                            <>
                                                <TableTop collapseAll={collapseAll} setCollapseAll={setCollapseAll} title={title} sections={sections} />
                                                <TableContainer>
                                                    <TableHeader>
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
                                                    </TableHeader>

                                                    {
                                                        floors && floors.map(floor => (
                                                            <React.Fragment key={floor}>
                                                                <TableWrapper collapseAll={collapseAll} floor={floor}>
                                                                    <tbody>

                                                                        {
                                                                            roomData?.data && (
                                                                                Object.keys(roomData.data)
                                                                                    .filter((key, index) => roomData.data[key].roomData.Floor === floor)
                                                                                    .sort((roomA, roomB) => {
                                                                                        return roomData.data[roomA].roomData.RoomNumber.localeCompare(roomData.data[roomB].roomData.RoomNumber, undefined, {
                                                                                            numeric: true,
                                                                                            sensitivity: "base"
                                                                                        });
                                                                                    })
                                                                                    .map((key, index, rowIndex) => (
                                                                                        <HeatingTableRowComponent
                                                                                        settingsUpdatedState={settingsUpdatedState}
                                                                                        buildingReFetch={buildingReFetch}
                                                                                        key={index}
                                                                                        roomData={roomData.data[key]}
                                                                                        totalColumns={14}
                                                                                        buildingData={roomData.data[key].buildingData}
                                                                                        roomTypeData={roomData.data[key].roomTypeData}
                                                                                        ventSystemData={roomData.data[key].ventSystemData} />
                                                                                    ))
                                                                            )
                                                                        }
                                                                        <tr className="bg-tertiary-color dark:bg-dark-secondary-color">
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
                                                                                    buildingData?.data?.floor_summaries_heating &&
                                                                                    Object.keys(buildingData.data.floor_summaries_heating)
                                                                                        .filter(key => key === floor)
                                                                                        .map(key => (
                                                                                            <React.Fragment key={key}>
                                                                                                <span className="text-heating-color"><strong>{Number(buildingData.data.floor_summaries_heating[key].demand.toFixed(0)).toLocaleString()}<br />W</strong></span>
                                                                                            </React.Fragment>
                                                                                        ))
                                                                                }
                                                                            </TableTDelement>
                                                                            <TableTDelement width="5%">
                                                                                {
                                                                                    buildingData?.data?.floor_summaries_heating &&
                                                                                    Object.keys(buildingData.data.floor_summaries_heating)
                                                                                        .filter(key => key === floor)
                                                                                        .map(key => (
                                                                                            <React.Fragment key={key}>
                                                                                                <span className="text-heating-color"><strong>{Number(buildingData.data.floor_summaries_heating[key].chosen.toFixed(0)).toLocaleString()}<br />W</strong></span>
                                                                                            </React.Fragment>
                                                                                        ))
                                                                                }
                                                                            </TableTDelement>
                                                                            <TableTDelement width="5%" />
                                                                            <TableTDelement width="8%" />
                                                                            <TableTDelement width="10%" />
                                                                        </tr>
                                                                    </tbody>
                                                                </TableWrapper>
                                                            </React.Fragment>
                                                        ))
                                                    }

                                                    <TableFooter>
                                                        <TableTDFooter width="2%" />
                                                        <TableTDFooter width="5%">
                                                            Sum
                                                        </TableTDFooter>
                                                        <TableTDFooter width="5%" />
                                                        <TableTDFooter width="5%" />
                                                        <TableTDFooter width="5%" />
                                                        <TableTDFooter width="5%" />
                                                        <TableTDFooter width="5%" />
                                                        <TableTDFooter width="5%" />
                                                        <TableTDFooter width="5%" />
                                                        <TableTDFooter width="5%">
                                                            <strong>
                                                                {buildingData?.data?.heatingDemand ? <><span className="text-heating-color">{((buildingData.data.heatingDemand) / 1000).toFixed(1)}</span> <br />kW</> : ''}
                                                            </strong>
                                                        </TableTDFooter>
                                                        <TableTDFooter width="5%">
                                                            <strong>
                                                                {buildingData?.data?.heating ? <><span className="text-heating-color">{((buildingData.data.heating) / 1000).toFixed(1)}</span> <br />kW</> : ''}
                                                            </strong>
                                                        </TableTDFooter>
                                                        <TableTDFooter width="5%" />
                                                        <TableTDFooter width="8%" />
                                                        <TableTDFooter width="10%" />
                                                    </TableFooter>

                                                </TableContainer>
                                            </>
                                        ) : (
                                            <>
                                                {
                                                    roomData?.success === false && <MessageBox message={`${roomData?.message ?? ERROR_FALLBACK_MSG}`} closeable={false} />
                                                }
                                            </>
                                        )
                                    }
                                </>
                            )
                        }

                    </>
                )
            }

        </>
    );
}

export default HeatingTable;