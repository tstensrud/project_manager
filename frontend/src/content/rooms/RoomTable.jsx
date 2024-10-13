import React, { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

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
import { ERROR_FALLBACK_MSG } from '../../utils/globals.js';
import LoadingSpinner from '../../layout/LoadingSpinner.jsx';

function RoomTable({ projectId, buildingUid, callRefetchOfRooms, setChildLoading }) {
    const { data: roomData, loading: roomDataLoading, error: roomDataError, refetch: buildingRoomsRefetch } = useFetch(`/project_api/${projectId}/rooms/building/${buildingUid}/`);
    const { data: buildingData, loading: buildingDataLoading, refetch: refetchBuilding, error: buildingDataError } = useFetch(`/project_api/${projectId}/buildings/get_building/${buildingUid}/`);

    const [floors, setFloors] = useState([]);
    const [collapseAll, setCollapseAll] = useState(true);

    const [sortbyName, setSortbyName] = useState(false);
    const [ascending, setAscending] = useState(true);

    const [searchParams, setSearchParams] = useSearchParams();
    const sortCategory = searchParams.get("sort");
    const sortOrder = searchParams.get("order");

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

    useEffect(() => {
        if (sortCategory === "name") {
            if (sortbyName) {
                setAscending(!ascending)
                return;
            }
            setSortbyName(true);

        } else if (sortCategory === "number") {
            if (!sortbyName) {
                setAscending(false);
                return;
            }
            setSortbyName(false);
        }
    }, [sortCategory, sortOrder]);

    useEffect(() => {
        if (sortOrder === "asc") {
            setAscending(true);
        } else if (sortOrder === "desc") {
            setAscending(false);
        }
    }, [sortOrder])

    const handleSortClick = (category, order) => {
        setSearchParams({ sort: category, order: order });
    }

    return (
        <>
            {
                roomDataLoading ? (
                    <LoadingSpinner text="rom" />
                ) : (
                    <>
                        {
                            roomData?.success && buildingData?.success && (
                                <>
                                    <TableTop collapseAll={collapseAll} setCollapseAll={setCollapseAll} title={title} sections={sections} />
                                    <TableContainer>
                                        <TableHeader>
                                            <TableTHelement width="2%" text="#" />
                                            <TableTHelement width="12%" text="Bygg" />
                                            <TableTHelement width="10%">
                                                {
                                                    ascending ? (
                                                        <div className={`group flex justify-center items-center ${!sortbyName ? 'font-semibold text-primary-color dark:text-dark-primary-color' : 'hover:text-primary-color hover:dark:text-dark-primary-color'} cursor-pointer transition duration-200`} onClick={() => handleSortClick("number", "desc")}>
                                                            <div>
                                                                Rom nr
                                                            </div>
                                                            <div className="pl-1">
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`stroke-grey-text dark:stroke-dark-grey-text fill-none cursor-pointer  transition duration-200 ${!sortbyName ? 'stroke-primary-color dark:stroke-dark-primary-color' : `group-hover:dark:stroke-dark-primary-color group-hover:stroke-primary-color`}`}>
                                                                    <polyline points="18 15 12 9 6 15"></polyline>
                                                                </svg>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className={`group flex justify-center items-center ${!sortbyName ? 'font-semibold text-primary-color dark:text-dark-primary-color' : 'hover:text-primary-color hover:dark:text-dark-primary-color'}  transition duration-200 cursor-pointer`} onClick={() => handleSortClick("number", "asc")}>
                                                            <div>
                                                                Rom nr
                                                            </div>
                                                            <div className="pr-1 rotate-180">
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`stroke-grey-text dark:stroke-dark-grey-text fill-none cursor-pointer  transition duration-200 ${!sortbyName ? 'stroke-primary-color dark:stroke-dark-primary-color' : `group-hover:dark:stroke-dark-primary-color group-hover:stroke-primary-color`}`}>
                                                                    <polyline points="18 15 12 9 6 15"></polyline>
                                                                </svg>
                                                            </div>
                                                        </div>
                                                    )
                                                }
                                            </TableTHelement>
                                            <TableTHelement width="15%" text="Romtype" />
                                            <TableTHelement width="10%">
                                                {
                                                    ascending ? (
                                                        <div className={`group flex justify-center items-center ${sortbyName ? 'font-semibold text-primary-color dark:text-dark-primary-color' : 'hover:text-primary-color font-normal hover:dark:text-dark-primary-color'} cursor-pointer transition duration-200`} onClick={() => handleSortClick("name", "desc")}>
                                                            <div>
                                                                Romnavn
                                                            </div>
                                                            <div className="pl-1">
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`stroke-grey-text dark:stroke-dark-grey-text fill-none cursor-pointer  transition duration-200 ${sortbyName ? 'stroke-primary-color dark:stroke-dark-primary-color' : `group-hover:dark:stroke-dark-primary-color group-hover:stroke-primary-color`}`}>
                                                                    <polyline points="18 15 12 9 6 15"></polyline>
                                                                </svg>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className={`group flex justify-center items-center ${sortbyName ? 'font-semibold text-primary-color dark:text-dark-primary-color' : 'hover:text-primary-color font-normal hover:dark:text-dark-primary-color'}  transition duration-200 cursor-pointer`} onClick={() => handleSortClick("name", "asc")}>
                                                            <div>
                                                                Romnavn
                                                            </div>
                                                            <div className="pr-1 rotate-180">
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`stroke-grey-text dark:stroke-dark-grey-text fill-none cursor-pointer  transition duration-200 ${sortbyName ? 'stroke-primary-color dark:stroke-dark-primary-color' : `group-hover:dark:stroke-dark-primary-color group-hover:stroke-primary-color`}`}>
                                                                    <polyline points="18 15 12 9 6 15"></polyline>
                                                                </svg>
                                                            </div>
                                                        </div>
                                                    )
                                                }
                                            </TableTHelement>
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
                                                                    Object.keys(roomData.data)
                                                                        .filter((key, index) => roomData.data[key].roomData.Floor === floor)
                                                                        .sort((roomA, roomB) => {
                                                                            if (sortbyName) {
                                                                                if (ascending) {
                                                                                    return (roomData.data[roomA].roomData.RoomName.localeCompare(roomData.data[roomB].roomData.RoomName))
                                                                                } else {
                                                                                    return (roomData.data[roomB].roomData.RoomName.localeCompare(roomData.data[roomA].roomData.RoomName))
                                                                                }
                                                                            } else {
                                                                                if (ascending) {
                                                                                    return roomData.data[roomA].roomData.RoomNumber.localeCompare(roomData.data[roomB].roomData.RoomNumber, undefined, {
                                                                                        numeric: true,
                                                                                        sensitivity: "base"
                                                                                    });
                                                                                } else {
                                                                                    return roomData.data[roomB].roomData.RoomNumber.localeCompare(roomData.data[roomA].roomData.RoomNumber, undefined, {
                                                                                        numeric: true,
                                                                                        sensitivity: "base"
                                                                                    });
                                                                                }
                                                                            }
                                                                        })
                                                                        .map((key, index) => (
                                                                            <RoomTableRowComponent index={index} key={roomData.data[key].roomData.uid} roomData={roomData.data[key].roomData} buildingData={roomData.data[key].buildingData} roomTypeData={roomData.data[key].roomTypeData} totalColumns={9} />
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
                            )
                        }
                    </>
                )
            }

            {roomData?.success === false && <MessageBox message={roomData?.message ?? ERROR_FALLBACK_MSG} closeable={false} />}
            {buildingData?.success === false && <MessageBox message={buildingData?.message ?? ERROR_FALLBACK_MSG} closeable={false} />}
            {roomDataError && <MessageBox error closeable={true} message={`${roomDataError} @ room data` ?? ERROR_FALLBACK_MSG} />}
            {buildingDataError && <MessageBox error closeable={true} message={`${buildingDataError} @ building data` ?? ERROR_FALLBACK_MSG} />}
        </>
    );
}

export default RoomTable;