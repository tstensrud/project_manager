import { useEffect, useState, useContext } from "react";
import { useParams } from 'react-router-dom';
import { GlobalContext } from '../GlobalContext';

import useFetch from '../hooks/useFetch'
import useSubmitData from "../hooks/useSubmitData";


function VentilationTableRowComponent({roomId}) {
        const {projectId} = useParams();
        const { activeProject, setActiveProject, token, setToken } = useContext(GlobalContext);
        const {data: roomData, loading: roomLoading, error: roomError, refetch: roomRefetch} = useFetch(`/rooms/${projectId}/get_room/${roomId}/`);
        const {data: allRoomData, response, setData, handleSubmit} = useSubmitData(`/rooms/${projectId}/update_room/`);
        const [editingCell, setEditingCell] = useState(null);
        const [editedData, setEditedData] = useState(null);
        
        useEffect(() => {
            setActiveProject(projectId);
        },[]);

        useEffect(() => {
            if(roomData) {
                setEditedData({ ...roomData });
            }
        },[roomData]);

        const handleEdit = (cellName) => {
            setEditingCell(cellName);
        };
    
        const handleChange = (e, cellName) => {
            setEditedData((prevData) => ({
                ...prevData,
                [cellName]: e.target.value,
            }));
        };
    
        const handleBlur = () => {
            setEditingCell(null);
            console.log(allRoomData, editedData);
        };
    
        const handleKeyDown = (e) => {
            if (e.key === "Enter") {
                handleBlur();
            }
        };

        const renderEditableCell = (cellName) => (
            <td name={cellName} onClick={() => handleEdit(cellName)}>
            {editingCell === cellName && editedData ? (
                <input
                    type="text"
                    className="table-input"
                    value={editedData[cellName]}
                    onChange={(e) => handleChange(e, cellName)}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                    autoFocus
                />
            ) : (
                editedData ? editedData.room_data[cellName] : ''
            )}
        </td>     
        );

        
    return (
        <>
        <tr>
            <td>{editedData ? editedData.room_data.BuildingId : ''}</td>
            <td>{editedData ? editedData.room_data.Floor : ''}</td>
            {renderEditableCell("RoomNumber")}
            <td>{editedData ? editedData.room_data.RoomTypeId : ''}</td>
            {renderEditableCell("RoomName")}
            {renderEditableCell("Area")}
            {renderEditableCell("RoomPopulation")}
            {renderEditableCell("Comment")}
            <td>
                <input type="text" value={roomId} hidden />
                <button className="table-button">Slett</button>
            </td>
        </tr>
        </>
    );
}

export default VentilationTableRowComponent;