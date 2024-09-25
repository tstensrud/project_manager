import React, { useEffect, useState } from 'react';

// Hooks + utils
import { customSortFloors } from '../../utils/customSortFloors.js'
import useFetch from '../../hooks/useFetch'

// Components
import RoomTableRowComponent from "./RoomTableRowComponent";
import Table from '../../layout/tableelements/Table.jsx';
import TableHeader from '../../layout/tableelements/TableHeader.jsx';
import TableTHelement from '../../layout/tableelements/TableTHelement.jsx';
import TableWrapper from '../../layout/tableelements/TableWrapper.jsx';
import TableContainer from '../../layout/tableelements/TableContainer.jsx';
import LoadingSpinner from '../../layout/LoadingSpinner.jsx';
import TableTop from '../../layout/TableTop';

//help
import { title, sections } from '../help/RoomsTableHelp.jsx';

function RoomTable({ projectId, buildingUid, callRefetchOfRooms, newRoomData }) {
    const { data: roomData, loading, refetch: buildingRoomsRefetch } = useFetch(`/project_api/${projectId}/rooms/building/${buildingUid}/`);
    const { data: buildingData, refetch: refetchBuilding } = useFetch(`/project_api/${projectId}/buildings/get_building/${buildingUid}/`);

    const [floors, setFloors] = useState([]);

    useEffect(() => {
        if (buildingData?.success === true) {
            const floorSummaryKeys = Object.values(buildingData?.data?.floors);
            const sortedKeys = customSortFloors(floorSummaryKeys);
            setFloors(sortedKeys);
        }
    }, [buildingData]);

    useEffect(() => {
        if (newRoomData?.floor && !floors.includes(newRoomData.floor)) {
            refetchBuilding();
        }
        buildingRoomsRefetch();
    }, [callRefetchOfRooms]);

    return (
        <>
            {
                loading ? (
                    <LoadingSpinner text="rom" />
                ) : (
                    <>
                        <TableTop title={title} sections={sections} />
                        <TableContainer>
                            <TableHeader>
                                <thead>
                                    <tr>
                                        <TableTHelement width="2%" text="#" />
                                        <TableTHelement width="12%" text="Bygg" />
                                        <TableTHelement width="10%" text="Romnr" />
                                        <TableTHelement width="15%" text="Romtype" />
                                        <TableTHelement width="10%" text="Romnavn" />
                                        <TableTHelement width="5%" text="Areal" />
                                        <TableTHelement width="5%" text="Personer" />
                                        <TableTHelement width="30%" text="Kommentarer" />
                                        <TableTHelement width="10%" text="Slett Rom" />
                                    </tr>
                                </thead>
                            </TableHeader>
                            {
                                floors && floors.map(floor => (
                                    <React.Fragment key={floor}>
                                        <TableWrapper floor={floor}>
                                            <Table>
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
                                                                .map(([key, room], index) => (
                                                                    <RoomTableRowComponent index={index} key={room.uid} allRoomData={room} totalColumns={9} roomId={room.uid} />
                                                                )
                                                                )
                                                        )
                                                    }
                                                </tbody>
                                            </Table>
                                        </TableWrapper>
                                    </React.Fragment>
                                ))}
                        </TableContainer>
                    </>
                )
            }

        </>
    );
}

export default RoomTable;