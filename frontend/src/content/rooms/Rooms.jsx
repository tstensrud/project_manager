import React, { useState, useEffect, useContext, useRef } from 'react'
import { useParams } from 'react-router-dom';
import { GlobalContext } from '../../GlobalContext';

import useFetch from '../../hooks/useFetch'
import useSubmitData from '../../hooks/useSubmitData'
import { customSortFloors } from '../../utils/customSortFloors.js'

import RoomIcon from '../../assets/svg/roomsIcon.svg?react'
import SubTitleComponent from '../../layout/SubTitleComponent';
import RoomTableRowComponent from "./RoomTableRowComponent";
import MessageBox from '../../layout/MessageBox';
import TableTop from '../../layout/TableTop';
import LoadingSpinner from '../../layout/LoadingSpinner';
import HelpBox from './HelpBox.jsx';


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
            console.log("Velg bygg");
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
            {newRoomDataResponse && newRoomDataResponse.error && newRoomDataResponse.error !== null ? (<MessageBox message={newRoomDataResponse.error} />) : (<></>)}
            <SubTitleComponent svg={<RoomIcon />} headerText={"Romskjema"} projectName={""} projectNumber={""} />
            <div className='main-content'>
                {
                    roomLoading === true || roomTypeLoading === true || buildingDataLoading === true ? (
                        <LoadingSpinner />
                    ) : (
                        <>
                            <div className="container-above-table-rooms-top">
                                <form id="new_room" onSubmit={handleOnSubmit}>
                                    <select ref={buildingRef} name="buildingUid" onChange={handleFormChange} tabIndex="1">
                                        <option key="0" value="">- Velg bygg -</option>
                                        {buildingData && buildingData.building_data && Object.keys(buildingData.building_data).map((key, index) => (
                                            <option key={index} value={buildingData.building_data[key].uid}>{buildingData.building_data[key].BuildingName}</option>
                                        ))}
                                    </select>
                                    &nbsp; &nbsp;
                                    <input className="input-short" type="text" name="floor" onChange={handleFormChange} placeholder="Etasje" tabIndex="2" required /> &nbsp; &nbsp;
                                    <input ref={inputRoomNumberRef} className="input-short" type="text" name="roomNumber" onChange={handleFormChange} placeholder="Romnr." tabIndex="3" required /> &nbsp; &nbsp;
                                    <select ref={roomTypeRef} onChange={handleFormChange} name="roomType" tabIndex="4">
                                        <option key="0" value="">- Velg romtype -</option>
                                        {roomTypeData && roomTypeData.spec_room_type_data !== undefined && roomTypeData.spec_room_type_data.map(type => (
                                            <option key={type.uid} value={type.uid}>{type.name}</option>
                                        ))};
                                    </select>
                                    &nbsp; &nbsp;
                                    <input ref={inputRoomNameRef} type="text" name="roomName" onChange={handleFormChange} placeholder="Romnavn" tabIndex="5" required /> &nbsp; &nbsp;
                                    <input ref={inputAreaRef} className="input-short" type="text" name="roomArea" onChange={handleFormChange} placeholder="Areal" tabIndex="6" required /> &nbsp; &nbsp;
                                    <input ref={inputPopRef} className="input-short" type="text" name="roomPeople" onChange={handleFormChange} placeholder="Personer" tabIndex="7" required /> &nbsp; &nbsp;
                                    <button className="form-button" type="submit" tabIndex="7">Legg til</button>
                                </form>
                            </div>
                            <div className="container-above-table-rooms-bottom">
                                {/*<button key="all" name="all" onClick={sortButtonClick} className={activeSortButton === "all" ? `table-sorting-button-active` : `table-sorting-button`}>Alle</button> &nbsp;*/}
                                {buildingData && buildingData.building_data !== undefined && Object.keys(buildingData.building_data).map((key, index) => (
                                    <button key={index} name={buildingData.building_data[key].uid} onClick={sortButtonClick} className={activeSortButton === buildingData.building_data[key].uid ? `table-sorting-button-active` : `table-sorting-button`}>
                                        {buildingData.building_data[key].BuildingName}&nbsp;
                                    </button>
                                ))}

                            </div>
                            {
                                activeSortButton === null ? (
                                    <>
                                        <div style={{ width: "100%", display: "flex", justifyContent: "center", marginTop: "50px" }}>
                                            Velg bygg
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        {
                                            roomData ? (
                                                roomData.room_data === null ? (
                                                    <div style={{ width: "100%", display: "flex", justifyContent: "center", marginTop: "50px" }}>
                                                        Ingen rom lagt til
                                                    </div>
                                                ) : (
                                                    <>

                                                        <TableTop info={<HelpBox />} />
                                                        <div className="table-container">
                                                            <div className="table-header-wrapper">
                                                                <table className="fl-table">
                                                                    <thead>
                                                                        <tr>
                                                                            <th width="2%">#</th>
                                                                            <th width="12%">Bygg</th>
                                                                            <th width="10%">Romnr</th>
                                                                            <th width="15%">Romtype</th>
                                                                            <th width="10%">Romnavn</th>
                                                                            <th width="5%">Areal <br /> m<sup>2</sup></th>
                                                                            <th width="5%">Personer</th>
                                                                            <th width="30%">Kommentarer</th>
                                                                            <th width="10%">Slett Rom</th>
                                                                        </tr>
                                                                    </thead>
                                                                </table>
                                                            </div>

                                                            {
                                                                floors && floors.map(floor => (
                                                                    <React.Fragment key={floor}>
                                                                        <div className="table-wrapper">
                                                                            
                                                                            <div className="table-title">
                                                                                <h3>Etasje {floor}</h3>
                                                                            </div>

                                                                            <table className="fl-table">
                                                                                <tbody>
                                                                                    {
                                                                                        sortedBuildings && sortedBuildings.length > 0 ? (
                                                                                            sortedBuildings.filter(room => room.Floor === floor).map((room) => <RoomTableRowComponent totalColumns={10} key={room.uid} roomId={room.uid} />)
                                                                                        ) : (<></>)
                                                                                    }
                                                                                </tbody>
                                                                            </table>
                                                                        </div>

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
            </div>
        </>
    );
}

export default Rooms;