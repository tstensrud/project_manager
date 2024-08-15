import { useState, useEffect, useContext, useRef } from 'react'
import { useParams } from 'react-router-dom';
import { GlobalContext } from '../../GlobalContext';

import useFetch from '../../hooks/useFetch'
import useSubmitData from '../../hooks/useSubmitData'

import RoomIcon from '../../assets/svg/roomsIcon.svg?react'
import SubTitleComponent from '../../layout/SubTitleComponent';
import RoomTableRowComponent from "./RoomTableRowComponent";
import MessageBox from '../../layout/MessageBox';
import TableTop from '../../layout/TableTop';


function Rooms () {
    const {projectId} = useParams();
    const {setActiveProject} = useContext(GlobalContext);
    
    // Form fields
    const roomTypeRef = useRef(null);
    const inputRoomNumberRef = useRef(null);
    const inputRoomNameRef = useRef(null);
    const inputAreaRef = useRef(null);
    const inputPopRef = useRef(null);

    // Initial fetch of data
    const {data: roomData, loading: roomLoading, error: roomError, refetch: roomRefetch} = useFetch(`/project_api/${projectId}/rooms/`);
    const [specId, setSpecId] = useState(null);
    const [fetchSpec, setFetchSpec] = useState(false);
    const {data: roomTypeData, loading: roomTypeLoading, error: roomTypeError, refetch: roomTypeRefetch} = useFetch( fetchSpec ? `/specifications/get_spec_room_types/${specId}/` : null);
    const {data: buildingData, loading: buildingDataLoading, error: buildingDataError, refetch: buildingReFetch} = useFetch(`/project_api/${projectId}/buildings/`);

    // Submit new room
    const {data: newRoomData, response, setData, handleSubmit} = useSubmitData(`/project_api/${projectId}/rooms/`);

    // Error messages from row components
    const [childMessage, setChildMessage] = useState('');

    // Sorting
    const [sortedBuildings, setSortedBuildings] = useState(roomData?.room_data || []);
    const [buildingUid, setBuildingUid] = useState(null);
    const [activeSortButton, setActivesortButton] = useState(null);

    // New room
    const [showNewRoomContainer, setShowNewRoomContainer] = useState(true);

    useEffect(() => {
        if (roomData && roomData.spec) {
            setSpecId(roomData.spec);
            setFetchSpec(true);
        }
    }, [roomData]);

    useEffect(() => {
        if (specId) {
            roomTypeRefetch();
        }
    }, [specId]);

    useEffect(() => {
        setSortedBuildings(roomData && roomData.room_data !== null && roomData.room_data.filter((room) => room.BuildingUid === buildingUid));
    },[roomData]);

    const handleChildMessage = (msg) => {
        setChildMessage('');
        if (msg !== undefined) {
            setChildMessage(msg);
        }
    }
    
    const sortButtonClick = (e) => {
        e.preventDefault();
        const sortBy = e.target.name;
        setActivesortButton(sortBy);

        if (sortBy === "all") {
            setBuildingUid(null);
            setSortedBuildings(roomData.room_data)
        } else {
            setBuildingUid(sortBy);
            setSortedBuildings(roomData.room_data.filter((room) => room.BuildingUid === sortBy));
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

        {response && response.error && response.error !== null ? (<MessageBox message={response.error} /> ) : (<></>)}

        <SubTitleComponent svg={<RoomIcon />} headerText={"Romskjema"} projectName={""} projectNumber={""} />
        
            <div className='main-content'>
                
                <div className="container-above-table-rooms-top">
                <form id="new_room" onSubmit={handleOnSubmit}>
                    <select ref={roomTypeRef} onChange={handleFormChange} name="roomType">
                        <option key="0" value="">- Velg romtype -</option>
                        {roomTypeData && roomTypeData.spec_room_type_data !== undefined && roomTypeData.spec_room_type_data.map(type => (<option key={type.uid} value={type.uid}>{type.name}</option>))};
                    </select>
                    &nbsp; &nbsp;
                    <select name="buildingUid" onChange={handleFormChange}>
                        <option key="0" value="">- Velg bygg -</option>
                        {buildingData && buildingData.building_data && Object.keys(buildingData.building_data).map((key, index) => (<option key={index} value={buildingData.building_data[key].uid}>{buildingData.building_data[key].BuildingName}</option>))}
                    </select>
                    &nbsp; &nbsp;
                    <input className="input-short" type="text" name="floor" onChange={handleFormChange} placeholder="Etasje" tabIndex="1" required /> &nbsp; &nbsp;
                    <input ref={inputRoomNumberRef} className="input-short" type="text" name="roomNumber" onChange={handleFormChange} placeholder="Romnr." tabIndex="2" required /> &nbsp; &nbsp;
                    <input ref={inputRoomNameRef} type="text" name="roomName" onChange={handleFormChange} placeholder="Romnavn" tabIndex="3" required /> &nbsp; &nbsp;
                    <input ref={inputAreaRef} className="input-short" type="text" name="roomArea" onChange={handleFormChange} placeholder="Areal" tabIndex="4" required /> &nbsp; &nbsp;
                    <input ref={inputPopRef} className="input-short" type="text" name="roomPeople" onChange={handleFormChange} placeholder="Personer" tabIndex="5" required /> &nbsp; &nbsp;
                    <button className="form-button" type="submit" tabIndex="6">Legg til</button>
                </form>
                </div>
                <div className="container-above-table-rooms-bottom">                    
                    {/*<button key="all" name="all" onClick={sortButtonClick} className={activeSortButton === "all" ? `table-sorting-button-active` : `table-sorting-button`}>Alle</button> &nbsp;*/}
                    {buildingData && buildingData.building_data !== undefined && Object.keys(buildingData.building_data).map((key, index) => (
                            <><button key={index} name={buildingData.building_data[key].uid} onClick={sortButtonClick} className={activeSortButton === buildingData.building_data[key].uid ? `table-sorting-button-active` : `table-sorting-button`}>
                                {buildingData.building_data[key].BuildingName}</button> &nbsp;</>
                            ))}
                   
                </div>
                <TableTop />
    {
        roomData ? (
            roomData.room_data === null ? (
            <p>Ingen rom lagt til</p>
        ) : (
            <div className="table-wrapper">
                <table className="fl-table" id="roomsTableVentilation">
                    <thead>
                        <tr>
                            <th width="2%">#</th>
                            <th width="4%">Bygg</th>
                            <th width="4%">Etasje</th>
                            <th width="6%">Romnr</th>
                            <th width="15%">Romtype</th>
                            <th width="10%">Romnavn</th>
                            <th width="5%">Areal <br/> m<sup>2</sup></th>
                            <th width="5%">Personer</th>
                            <th width="38%">Kommentarer</th>
                            <th width="10%">Slett Rom</th>
                         </tr>
                    </thead>
                    <tbody>
                        {
                            sortedBuildings && sortedBuildings.length > 0 ? (
                            sortedBuildings.map((room, index) => <RoomTableRowComponent index={index} msgToParent={handleChildMessage} totalColumns={10} key={room.uid} roomId={room.uid}/>)
                        ) : (
                                <>
                                <th>
                                    <td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>
                                </th>
                                </>
                            )
                        }
                    </tbody>
                </table>
            </div>
            )
        ) : (<span>&nbsp;&nbsp;&nbsp;Laster inn rom</span>)
    }
        </div>       
        </>
    );
}

export default Rooms;