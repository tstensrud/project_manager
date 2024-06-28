import { useState, useEffect, useContext, useSyncExternalStore } from 'react'
import { useParams } from 'react-router-dom';
import { GlobalContext } from '../../GlobalContext';

import useFetch from '../../hooks/useFetch'
import useSubmitData from '../../hooks/useSubmitData'

import SubTitleComponent from '../../layout/SubTitleComponent';
import TableHeaderComponent from "../../tables/TableHeaderComponent";
import VentilationTableRowComponent from "../../tables/VentilationTableRowComponent";


function Rooms () {
    const specificationId = 1;
    const {projectId} = useParams();
    const { activeProject, setActiveProject, token, setToken } = useContext(GlobalContext);
    const {data: roomData, loading: roomLoading, error: roomError, refetch: roomRefetch} = useFetch(`/rooms/${projectId}/`);
    const {data: roomTypeData, loading: roomTypeLoading, error: roomTypeError, refetch: roomTypeRefetch} = useFetch(`/specifications/get_spec_room_types/${specificationId}/`);
    const {data: buildingData, loading: buildingDataLoading, error: buildingDataError, refetch: buildingReFetch} = useFetch(`/buildings/${projectId}/get_project_buildings/`);
    const {data: allRoomData, response, setData, handleSubmit} = useSubmitData(`/rooms/${projectId}/`);
    
    const [childMessage, setChildMessage] = useState('');
    const [errorPopUpClass, setErrorPopUpClass] = useState('popup-hide');
    const [childMessagePopUpClass, setChildMessagePopUpClass] = useState('popup-hide');
    
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
            console.log("CHILD MESSAGE: " + msg)
        }
    }

    const closeMessagePopUp = () => {
        setChildMessagePopUpClass('popup-hide');
        setErrorPopUpClass('popup-hide')
    }
    
    const handleFormChange = (e) => {
        setData({
            ...allRoomData,
            [e.target.name]: e.target.value,
        })
    }

    const handleOnSubmit = async (e) => {
        e.preventDefault();
        await handleSubmit(e);
        roomRefetch();
        // reset input fields roomtype, area, people, name. Leave floor and building.
    }
  
    return (
        <>

        { response && response.error !== null ? (
        <div className={errorPopUpClass}>
            <span className="popup-close" onClick={closeMessagePopUp}>×</span>
            <p>Feil: {response.error}</p>
        </div> ) : (<span>asdf</span>)}

        { childMessage && childMessage !== undefined || childMessage !== '' ? (
        <div className={errorPopUpClass}>
            <span className="popup-close" onClick={closeMessagePopUp}>×</span>
            <p>Feil: {childMessage}</p>
        </div> ) : (<span></span>)}

        <SubTitleComponent>
            Romskjema
        </SubTitleComponent>


            <div className="no-print">
                <form id="new_room" onSubmit={handleOnSubmit}>
                <p>Legg til nytt rom</p>
                    <p>
                        
                        <select onChange={handleFormChange} name="roomType">
                            <option key="0" value="">- Velg romtype -</option>
                            {roomTypeData && roomTypeData.spec_room_type_data.map(type => (<option key={type.id} value={type.id}>{type.name}</option>))};
                        </select>
                        
                        <select name="buildingId" onChange={handleFormChange}>
                            <option key="0" value="">- Velg bygg -</option>
                            {buildingData && Object.entries(buildingData.building_data).map(([key, value]) => (<option key={key} value={key}>{value}</option>))}
                        </select>

                        <input type="text" name="floor" onChange={handleFormChange} placeholder="Etasje" tabIndex="1" required />
                        <input type="text" name="roomNumber" onChange={handleFormChange} placeholder="Romnummer" tabIndex="2" required />
                        <input type="text" name="roomName" onChange={handleFormChange}  placeholder="Romnavn" tabIndex="3" required />
                        <input type="text" name="roomArea" onChange={handleFormChange} placeholder="Areal" tabIndex="4" required />
                        <input type="text" name="roomPeople" onChange={handleFormChange} placeholder="Antall personer" tabIndex="5" required />
                        <button className="form-button" type="submit" tabIndex="6">Legg til</button>

                    </p>
                </form>
            </div>

        <SubTitleComponent>
            Romliste
        </SubTitleComponent>
            
            
    {
        roomData ? (
            roomData.room_data === null ? (
            <p>Ingen rom lagt til asdf</p>
        ) : (
            <div className="table-wrapper">
                <table className="fl-table" id="roomsTableVentilation">
                    <thead>
                        <TableHeaderComponent headers={columnTitles} />
                    </thead>
                    <tbody>
                        {
                            roomData && roomData.room_data ? (
                            roomData.room_data.map((room) => <VentilationTableRowComponent msgToParent={handleChildMessage} key={room.id} roomId={room.id}/>)
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
        ) : (
        <span>Loading...</span>
        )
    }

        </>
    );
}

export default Rooms;