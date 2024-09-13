import React, { useState, useEffect, useContext, useRef } from 'react'
import { useParams } from 'react-router-dom';
import { GlobalContext } from '../../GlobalContext';

import useFetch from '../../hooks/useFetch'
import useSubmitData from '../../hooks/useSubmitData'
import { customSortFloors } from '../../utils/customSortFloors.js'

// components
import RoomIcon from '../../assets/svg/roomsIcon.jsx'
import SubTitleComponent from '../../layout/SubTitleComponent';
import RoomTableRowComponent from "./RoomTableRowComponent";
import MessageBox from '../../layout/MessageBox';
import TableTop from '../../layout/TableTop';
import LoadingSpinner from '../../layout/LoadingSpinner';
import HelpBox from './HelpBox.jsx';
import MainContentContainer from '../../layout/MainContentContainer.jsx';
import FormButton from '../../layout/formelements/FormButton.jsx';
import InputField from '../../layout/formelements/InputField.jsx';
import SelectElement from '../../layout/formelements/SelectElement.jsx';
import SortingButton from '../../layout/formelements/SortingButton.jsx';
import ActiveSortingButton from '../../layout/formelements/ActiveSortingButton.jsx'
import Table from '../../layout/tableelements/Table.jsx';
import TableHeader from '../../layout/tableelements/TableHeader.jsx';
import TableTHelement from '../../layout/tableelements/TableTHelement.jsx';
import FloorTitleBar from '../../layout/tableelements/FloorTitleBar.jsx';
import TableWrapper from '../../layout/tableelements/TableWrapper.jsx';



function Rooms() {
    const { projectId } = useParams();

    // Form fields
    const roomTypeRef = useRef(null);
    const inputRoomNumberRef = useRef(null);
    const inputRoomNameRef = useRef(null);
    const inputAreaRef = useRef(null);
    const inputPopRef = useRef(null);
    const buildingRef = useRef(null);

    // Initial fetch of data
    const [specId, setSpecId] = useState(null);
    const [fetchSpec, setFetchSpec] = useState(false);
    const { data: roomData, loading: roomLoading, error: roomError, refetch: roomRefetch } = useFetch(`/project_api/${projectId}/rooms/`);
    const { data: roomTypeData, loading: roomTypeLoading, error: roomTypeError, refetch: roomTypeRefetch } = useFetch(fetchSpec ? `/specifications/get_spec_room_types/${specId}/` : null);
    const { data: buildingData, loading: buildingDataLoading, error: buildingDataError, refetch: buildingReFetch } = useFetch(`/project_api/${projectId}/buildings/`);



    // Submit new room
    const { data: newRoomData, response: newRoomDataResponse, setData, handleSubmit } = useSubmitData(`/project_api/${projectId}/rooms/`);

    // Sorting
    const [sortedBuildings, setSortedBuildings] = useState(roomData?.room_data || []);
    const [buildingUid, setBuildingUid] = useState(null);
    const [activeSortButton, setActivesortButton] = useState(null);
    const [buildingSummaryData, setBuildingSummaryData] = useState(null);
    const [floors, setFloors] = useState([]);

    // useEffects
    useEffect(() => {
        const filteredBuildingData = buildingData && buildingData.building_data
            ? buildingData.building_data.filter((building) => building.uid === activeSortButton)
            : null;
        setBuildingSummaryData(filteredBuildingData);
    }, [activeSortButton, buildingData]);

    useEffect(() => {
        if (buildingSummaryData && buildingSummaryData[0] && buildingSummaryData[0].floor_summaries) {
            const floorSummaryKeys = Object.keys(buildingSummaryData[0].floor_summaries);
            const sortedKeys = customSortFloors(floorSummaryKeys);
            setFloors(sortedKeys);
        }
    }, [buildingSummaryData]);

    useEffect(() => {
        if (roomData && roomData.spec) {
            setSpecId(roomData.spec);
            setFetchSpec(true);
        }
    }, [roomData]);

    useEffect(() => {
        setData({})
    }, [newRoomDataResponse]);

    useEffect(() => {
        if (specId) {
            roomTypeRefetch();
        }
    }, [specId]);

    useEffect(() => {
        setSortedBuildings(roomData && roomData.room_data !== null && roomData.room_data.filter((room) => room.BuildingUid === buildingUid));
    }, [roomData]);


    // Handlers
    const sortButtonClick = (e) => {
        e.preventDefault();
        const sortBy = e.target.name;
        setActivesortButton(sortBy);

        if (sortBy === "all") {
            setBuildingUid(null);
            setSortedBuildings(roomData.room_data)
        } else {
            setBuildingUid(sortBy);
            if (roomData.room_data !== null) {
                setSortedBuildings(roomData.room_data.filter((room) => room.BuildingUid === sortBy));
            }
            else {
                return;
            }

        }
    }

    const handleFormChange = (e) => {
        setData({
            ...newRoomData,
            [e.target.name]: e.target.value,

        })
    }

    const handleOnSubmit = async (e) => {
        e.preventDefault();
        if (!newRoomData.buildingUid) {
            buildingRef.current.focus();
            return;
        }
        else if (!newRoomData.roomType) {
            roomTypeRef.current.focus();
            return;
        }
        await handleSubmit(e);
        roomRefetch();
        inputRoomNumberRef.current.value = '';
        inputRoomNameRef.current.value = '';
        inputAreaRef.current.value = '';
        inputPopRef.current.value = '';
        roomTypeRef.current.value = roomTypeRef.current.options[0].value;
    }

    return (
        <>
            {newRoomDataResponse?.error ? (<MessageBox message={newRoomDataResponse.error} />) : (<></>)}
            <SubTitleComponent svg={<RoomIcon />} headerText={"Romskjema"} projectName={""} projectNumber={""} />
            <MainContentContainer>
                {
                    roomLoading === true || roomTypeLoading === true || buildingDataLoading === true ? (
                        <LoadingSpinner />
                    ) : (
                        <>
                            <div className="flex h-20 items-center justify-center text-center flex-row w-full">
                                <form onSubmit={handleOnSubmit}>
                                    <div className="flex flex-row w-full">
                                        <div className="mr-2">
                                            <SelectElement ref={buildingRef} name="buildingUid" changeFunction={handleFormChange} tabIndex={1}>
                                                <option key="0" value="">- Velg bygg -</option>
                                                {buildingData && buildingData.building_data && Object.keys(buildingData.building_data).map((key, index) => (
                                                    <option key={index} value={buildingData.building_data[key].uid}>{buildingData.building_data[key].BuildingName}</option>
                                                ))}
                                            </SelectElement>
                                        </div>

                                        <div className="mr-2 w-24">
                                            <InputField name="floor" changeFunction={handleFormChange} placeholder="Etasje" tabIndex={2} required={true} />
                                        </div>
                                        <div className="mr-2 w-36">
                                            <InputField ref={inputRoomNumberRef} name="roomNumber" changeFunction={handleFormChange} placeholder="Romnr" tabIndex={3} required={true} />
                                        </div>
                                        <div className="mr-2">
                                            <SelectElement ref={roomTypeRef} name="roomType" changeFunction={handleFormChange} tabIndex={4}>
                                                <option key="0" value="">- Velg romtype -</option>
                                                {roomTypeData && roomTypeData.spec_room_type_data !== undefined && roomTypeData.spec_room_type_data.map(type => (
                                                    <option key={type.uid} value={type.uid}>{type.name}</option>
                                                ))};
                                            </SelectElement>
                                        </div>
                                        <div className="mr-2 w-52">
                                            <InputField ref={inputRoomNameRef} name="roomName" changeFunction={handleFormChange} placeholder="Romnavn" tabIndex={5} required={true} />
                                        </div>
                                        <div className="mr-2 w-24">
                                            <InputField ref={inputAreaRef} name="roomArea" changeFunction={handleFormChange} placeholder="Areal" tabIndex={6} required={true} />
                                        </div>
                                        <div className="mr-2 w-24">
                                            <InputField ref={inputPopRef} name="roomPeople" changeFunction={handleFormChange} placeholder="Personer" tabIndex={7} required={true} />
                                        </div>
                                        <div className="mr-2">
                                            <FormButton buttonText="Legg til" tabIndex={7} />
                                        </div>
                                    </div>
                                </form>
                            </div>

                            <div className="flex flex-row w-full justify-center">
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
                                    <>
                                        <div className="w-full flex justify-center mt-12">
                                            Velg bygg
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        {
                                            roomData ? (
                                                roomData.room_data === null ? (
                                                    <div className="w-full flex justify-center mt-12">
                                                        Ingen rom lagt til
                                                    </div>
                                                ) : (
                                                    <>

                                                        <TableTop info={<HelpBox />} />
                                                        <div className="flex flex-col h-[80%] overflow-y-auto">
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
                                                                                        sortedBuildings && sortedBuildings.length > 0 ? (
                                                                                            sortedBuildings.filter(room => room.Floor === floor).map((room) => <RoomTableRowComponent totalColumns={10} key={room.uid} roomId={room.uid} />)
                                                                                        ) : (<></>)
                                                                                    }
                                                                                </tbody>
                                                                            </Table>
                                                                        </TableWrapper>
                                                                    </React.Fragment>
                                                                ))}
                                                        </div>
                                                    </>
                                                )
                                            ) : (<></>)
                                        }
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

export default Rooms;