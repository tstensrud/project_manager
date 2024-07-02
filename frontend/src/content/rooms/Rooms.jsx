import { useState, useEffect, useContext } from 'react'
import { useParams } from 'react-router-dom';
import { GlobalContext } from '../../GlobalContext';

import useFetch from '../../hooks/useFetch'
import useSubmitData from '../../hooks/useSubmitData'

import RoomIcon from '../../assets/svg/roomsIcon.svg?react'
import SubTitleComponent from '../../layout/SubTitleComponent';
import TableHeaderComponent from "../../tables/TableHeaderComponent";
import RoomTableRowComponent from "../../tables/RoomTableRowComponent";


function Rooms () {
    const {projectId} = useParams();
    const {setActiveProject} = useContext(GlobalContext);
    const {data: roomData, loading: roomLoading, error: roomError, refetch: roomRefetch} = useFetch(`/project_api/${projectId}/rooms/`);
    const [specId, setSpecId] = useState(null);
    const [fetchSpec, setFetchSpec] = useState(false);
    const {data: roomTypeData, loading: roomTypeLoading, error: roomTypeError, refetch: roomTypeRefetch} = useFetch( fetchSpec ? `/specifications/get_spec_room_types/${specId}/` : null);
    const {data: buildingData, loading: buildingDataLoading, error: buildingDataError, refetch: buildingReFetch} = useFetch(`/project_api/${projectId}/buildings/get_project_buildings/`);
    const {data: newRoomData, response, setData, handleSubmit} = useSubmitData(`/project_api/${projectId}/rooms/`);
    const [childMessage, setChildMessage] = useState('');
    const [errorPopUpClass, setErrorPopUpClass] = useState('popup-hide');
    const [childMessagePopUpClass, setChildMessagePopUpClass] = useState('popup-hide');

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
        setActiveProject(projectId);
    },[]);

    useEffect(() => {
        if (response && response.error !== null) {
            setErrorPopUpClass('popup-show');
        } else {
            setErrorPopUpClass('popup-hide');
        }
    }, [response]);
    
    useEffect(() => {
        if (childMessage && childMessage !== undefined && childMessage !== '') {
            setChildMessagePopUpClass('popup-show');
        } else {
            setChildMessagePopUpClass('popup-hide');
        }
    }, [childMessage]);

    const columnTitles = [  {text: "Bygg"},
                            {text: "Etasje"},
                            {text: "Romnr"},
                            {text: "Romtype"},
                            {text: "Romnavn"},
                            {text: "Areal m2"},
                            {text: "Personer"},
                            {text: "Kommentarer"},
                            {text: "Slett rom"}
    ];

    const handleChildMessage = (msg) => {
        if (msg !== undefined) {
            setChildMessage(msg);
        }
    }

    const closeMessagePopUp = () => {
        setChildMessagePopUpClass('popup-hide');
        setErrorPopUpClass('popup-hide');
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
        
    }
  
    return (
        <>

        {response && response.error && response.error !== null ? (
        <div className={errorPopUpClass}>
            <span className="popup-close" onClick={closeMessagePopUp}>×</span>
            <p>Feil: {response.error}</p>
        </div> ) : (<span></span>)}

        { childMessage && childMessage !== undefined || childMessage !== '' ? (
        <div className={childMessagePopUpClass}>
            <span className="popup-close" onClick={closeMessagePopUp}>×</span>
            <p>Feil: {childMessage}</p>
        </div> ) : (<span></span>)}

        <SubTitleComponent>
           <RoomIcon/> Romskjema
        </SubTitleComponent>
            <div className='main-content'>
                <div className="text-container-above-tables">
                    <div className="no-print">
                        <form id="new_room" onSubmit={handleOnSubmit}>
                            <p>Legg til nytt rom</p>
                            <p>

                                <select onChange={handleFormChange} name="roomType">
                                    <option key="0" value="">- Velg romtype -</option>
                                    {roomTypeData && roomTypeData.spec_room_type_data !== undefined && roomTypeData.spec_room_type_data.map(type => (<option key={type.id} value={type.id}>{type.name}</option>))};
                                </select>
                                &nbsp; &nbsp;
                                <select name="buildingId" onChange={handleFormChange}>
                                    <option key="0" value="">- Velg bygg -</option>
                                    {buildingData && Object.entries(buildingData.building_data).map(([key, value]) => (<option key={key} value={key}>{value}</option>))}
                                </select>
                                &nbsp; &nbsp;
                                <input className="input-short" type="text" name="floor" onChange={handleFormChange} placeholder="Etasje" tabIndex="1" required /> &nbsp; &nbsp;
                                <input className="input-short" type="text" name="roomNumber" onChange={handleFormChange} placeholder="Romnr." tabIndex="2" required /> &nbsp; &nbsp;
                                <input type="text" name="roomName" onChange={handleFormChange} placeholder="Romnavn" tabIndex="3" required /> &nbsp; &nbsp;
                                <input className="input-short" type="text" name="roomArea" onChange={handleFormChange} placeholder="Areal" tabIndex="4" required /> &nbsp; &nbsp;
                                <input className="input-short" type="text" name="roomPeople" onChange={handleFormChange} placeholder="Personer" tabIndex="5" required /> &nbsp; &nbsp;
                                <button className="form-button" type="submit" tabIndex="6">Legg til</button>

                            </p>
                        </form>
                    </div>
                </div>
            
            
    {
        roomData ? (
            roomData.room_data === null ? (
            <p>Ingen rom lagt til</p>
        ) : (
            <div className="table-wrapper">
                <table className="fl-table" id="roomsTableVentilation">
                    <thead>
                        <TableHeaderComponent headers={columnTitles} />
                    </thead>
                    <tbody>
                        {
                            roomData && roomData.room_data ? (
                            roomData.room_data.map((room) => <RoomTableRowComponent msgToParent={handleChildMessage} key={room.uid} roomId={room.uid}/>)
                            ) : (
                                <>
                                <span>Ingen rom lagt inn</span>
                                </>
                            )
                        }
                    </tbody>
                </table>
            </div>
            )
        ) : (<span>Loading...</span>)
    }
        </div>       
        </>
    );
}

export default Rooms;