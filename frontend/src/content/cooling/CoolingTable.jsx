import React, { useEffect, useState } from 'react';

// Hooks and utils
import useFetch from '../../hooks/useFetch.jsx'
import { customSortFloors } from '../../utils/customSortFloors.js'

//Components
import TableHeader from '../../layout/tableelements/TableHeader.jsx';
import TableTHelement from '../../layout/tableelements/TableTHelement.jsx';
import TableContainer from '../../layout/tableelements/TableContainer.jsx';
import TableWrapper from "../../layout/tableelements/TableWrapper.jsx";
import CoolingTableRowComponent from "./CoolingTableRowComponent.jsx";
import TableTop from '../../layout/TableTop.jsx';
import LoadingSpinner from '../../layout/LoadingSpinner.jsx';

// help
import { title, sections } from '../help/CoolingTableHelp.jsx'

function CoolingTable({ projectId, buildingUid, settingsUpdatedState }) {
    const { data: roomData, loading } = useFetch(`/project_api/${projectId}/rooms/building/${buildingUid}/`);
    const { data: buildingData, refetch: buildingReFetch } = useFetch(`/project_api/${projectId}/cooling/building_data/${buildingUid}/`);

    const [floors, setFloors] = useState([]);
    const [collapseAll, setCollapseAll] = useState(true);

    useEffect(() => {
        if (buildingData?.success === true) {
            const floorSummaryKeys = Object.values(buildingData?.data?.floors);
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
                                <TableTHelement width="5%">Romtemp <br /> &#176;C</TableTHelement>
                                <TableTHelement width="5%">Temp vent<br /> &#176;C</TableTHelement>
                                <TableTHelement width="5%">W/Pers</TableTHelement>
                                <TableTHelement width="5%">Lys<br /> W/m<sup>2</sup></TableTHelement>
                                <TableTHelement width="5%">Ustyr<br /> W/m<sup>2</sup></TableTHelement>
                                <TableTHelement width="5%">Soltilskudd<br /> W/m<sup>2</sup></TableTHelement>
                                <TableTHelement width="5%">Solreduksjon<br /> (0-1,0)</TableTHelement>
                                <TableTHelement width="5%">&#8721; Internlast<br /> W</TableTHelement>
                                <TableTHelement width="5%">Kjøling utstyr<br /> W</TableTHelement>
                                <TableTHelement width="5%">&#8721; kjøling<br /> W</TableTHelement>
                                <TableTHelement width="5%">Ekstra vent. <br />m<sup>3</sup>/h</TableTHelement>
                                <TableTHelement width="34%">Merknad</TableTHelement>
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
                                                                <CoolingTableRowComponent settingsUpdatedState={settingsUpdatedState} key={room.uid} totalColumns={14} roomId={room.uid} />
                                                            ))
                                                    )
                                                }
                                            </tbody>
                                        </TableWrapper>
                                    </React.Fragment>
                                ))
                            }
                        </TableContainer>
                    </>
                )
            }
        </>
    );
}

export default CoolingTable;