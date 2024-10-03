import React, { useEffect, useState } from 'react';

// Hooks + utils
import { customSortFloors } from '../../utils/customSortFloors.js'
import useFetch from '../../hooks/useFetch'

// Components
import RoomTableRowComponent from "./RoomTableRowComponent";
import TableHeader from '../../layout/tableelements/TableHeader.jsx';
import TableTHelement from '../../layout/tableelements/TableTHelement.jsx';
import TableWrapper from '../../layout/tableelements/TableWrapper.jsx';
import TableContainer from '../../layout/tableelements/TableContainer.jsx';
import TableFooter from '../../layout/tableelements/TableFooter.jsx'
import TableTop from '../../layout/TableTop';

//help
import { title, sections } from '../help/RoomsTableHelp.jsx';
import MessageBox from '../../layout/MessageBox.jsx';

function RoomTable({ projectId, buildingUid, callRefetchOfRooms, setChildLoading }) {
    const { data: roomData, loading: roomDataLoading, error: roomDataError, refetch: buildingRoomsRefetch } = useFetch(`/project_api/${projectId}/rooms/building/${buildingUid}/`);
    const { data: buildingData, refetch: refetchBuilding, error: buildingDataError } = useFetch(`/project_api/${projectId}/buildings/get_building/${buildingUid}/`);

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
        setChildLoading(roomDataLoading);
    }, [roomDataLoading]);

    useEffect(() => {
        refetchBuilding();
        buildingRoomsRefetch();
    }, [callRefetchOfRooms]);

    return (
        <>
            {roomDataError && <MessageBox closeable={true} message={roomDataError} />}
            {buildingDataError && <MessageBox closeable={true} message={buildingDataError} />}
            {
                roomData?.success && buildingData?.success ? (
                    <>
                        <TableTop collapseAll={collapseAll} setCollapseAll={setCollapseAll} title={title} sections={sections} />
                        <TableContainer>
                            <TableHeader>
                                <TableTHelement width="2%" text="#" />
                                <TableTHelement width="12%" text="Bygg" />
                                <TableTHelement width="10%" text="Romnr" />
                                <TableTHelement width="15%" text="Romtype" />
                                <TableTHelement width="10%" text="Romnavn" />
                                <TableTHelement width="5%" text="Areal" />
                                <TableTHelement width="5%" text="Personer" />
                                <TableTHelement width="30%" text="Kommentarer" />
                                <TableTHelement width="10%" text="Slett Rom" />
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
                                                            .map(([key, room], index) => (
                                                                <RoomTableRowComponent index={index} key={room.uid} allRoomData={room} totalColumns={9} roomId={room.uid} />
                                                            )
                                                            )
                                                    )
                                                }
                                            </tbody>
                                        </TableWrapper>
                                    </React.Fragment>
                                ))
                            }
                        </TableContainer>
                        <TableFooter>
                            <td className="h-6" colspan="9"></td>
                        </TableFooter>
                    </>
                ) : (
                    <>
                    {
                        !roomDataLoading && <MessageBox message={`${roomData?.message ?? ''} ${buildingData?.message ?? ''}`} closeable={false} />
                    }
                    </>
                )
            }
        </>
    );
}

export default RoomTable;