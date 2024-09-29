import React, { useEffect, useState } from 'react';

// Hooks and utils
import useFetch from '../../hooks/useFetch'
import { customSortFloors } from '../../utils/customSortFloors.js'

//Components
import TableHeader from '../../layout/tableelements/TableHeader.jsx';
import TableTHelement from '../../layout/tableelements/TableTHelement.jsx';
import TableTDelement from "../../layout/tableelements/TableTDelement.jsx";
import TableContainer from '../../layout/tableelements/TableContainer.jsx';
import TableWrapper from "../../layout/tableelements/TableWrapper.jsx";
import HeatingTableRowComponent from "./HeatingTableRowComponent";
import TableTop from '../../layout/TableTop.jsx';
import LoadingSpinner from '../../layout/LoadingSpinner.jsx';

// help
import { title, sections } from '../help/HeatingTableHelp.jsx'

function HeatingTable({ projectId, buildingUid, settingsUpdatedState }) {
    const { data: roomData, loading } = useFetch(`/project_api/${projectId}/rooms/building/${buildingUid}/`);
    const { data: buildingData, refetch: buildingReFetch } = useFetch(`/project_api/${projectId}/heating/building_data/${buildingUid}/`);

    const [floors, setFloors] = useState([]);
    const [collapseAll, setCollapseAll] = useState(true);

    useEffect(() => {
        if (buildingData?.success === true) {
            const floorSummaryKeys = Object.keys(buildingData?.data?.floor_summaries_heating);
            const sortedKeys = customSortFloors(floorSummaryKeys);
            setFloors(sortedKeys);
        }
    }, [buildingData]);

    useEffect(() => {
        buildingReFetch();
    }, [settingsUpdatedState]);

    return (
        <>
            {
                loading ? (
                    <LoadingSpinner text="rom" />
                ) : (
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
                                                        Object.entries(roomData.data)
                                                            .filter(([key, room]) => room.Floor === floor)
                                                            .sort(([, roomA], [, roomB]) => {
                                                                return roomA.RoomNumber.localeCompare(roomB.RoomNumber, undefined, {
                                                                    numeric: true,
                                                                    sensitivity: "base"
                                                                });
                                                            })
                                                            .map(([key, room]) => (
                                                                <HeatingTableRowComponent settingsUpdatedState={settingsUpdatedState} buildingReFetch={buildingReFetch} key={room.uid} allRoomData={room} totalColumns={14} roomId={room.uid} buildingData={buildingData} />
                                                            ))
                                                    )
                                                }
                                                <tr className="bg-secondary-color dark:bg-dark-secondary-color">
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

                            <TableWrapper>
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
                                                {buildingData?.data?.heatingDemand ? <><span className="text-heating-color">{((buildingData.data.heatingDemand) / 1000).toFixed(1)}</span> <br />kW</> : ''}
                                            </strong>
                                        </TableTDelement>
                                        <TableTDelement width="5%">
                                            <strong>
                                                {buildingData?.data?.heating ? <><span className="text-heating-color">{((buildingData.data.heating) / 1000).toFixed(1)}</span> <br />kW</> : ''}
                                            </strong>
                                        </TableTDelement>
                                        <TableTDelement width="5%" />
                                        <TableTDelement width="8%" />
                                        <TableTDelement width="10%" />
                                    </tr>
                                </tfoot>
                            </TableWrapper>

                        </TableContainer>
                    </>
                )
            }

        </>
    );
}

export default HeatingTable;