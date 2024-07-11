import { useEffect, useState, useContext } from "react";
import { useParams } from 'react-router-dom';
import { GlobalContext } from '../../GlobalContext';

import useFetch from '../../hooks/useFetch'
import useUpdateData from '../../hooks/useUpdateData'
import useDeleteData from '../../hooks/useDeleteData'
import MessageBox from '../../layout/MessageBox';


function RoomTableRowComponent({roomId, msgToParent, index}) {
        const {projectId} = useParams();
        const { activeProject, setActiveProject, token, setToken } = useContext(GlobalContext);

        // Initial fetches
        const {data: roomData, loading: roomLoading, error: roomError, refetch: roomRefetch} = useFetch(`/project_api/${projectId}/rooms/get_room/${roomId}/`);
        
        // Update and delete
        const {data: updatedRoomData, response, setData, handleSubmit: updateRoomData} = useUpdateData(`/project_api/${projectId}/rooms/update_room/${roomId}/`);
        const {data: deleteRoomId, responseDeleteRoom, setData: setDeleteData, handleSubmit: deleteSubmit} = useDeleteData(`/project_api/${projectId}/rooms/delete_room/${roomId}/`);

        // Edit cells
        const [editingCell, setEditingCell] = useState(null);
        const [editedData, setEditedData] = useState(null);
        const [disabledDeleteButton, setDisabledDeleteButton] = useState(false);
        const [cellClass, setRowClass] = useState("");

        // Row marking
        const [markedRow, setMarkedRow] = useState('');

        // Use effects
        useEffect(() => {
            setActiveProject(projectId);
            setDeleteData({"roomId": roomId});
        },[]);

        useEffect(() => {
            if(roomData) {
                setEditedData('');
            }
        },[roomData]);

        
        // Handlers
        const sendMessageToParent = (msg) => {
            msgToParent(msg);
        }

        const handleEdit = (cellName) => {
            setEditingCell(cellName);
        };
    
        const handleChange = (e, cellName) => {
            setData((prevData) => ({
                ...prevData,
                [cellName]: e.target.value,
            }));
        };
        
        const onDelete = async (e) => {
            await deleteSubmit(e);
            setDisabledDeleteButton(true);
            setRowClass("deleted-row")
            sendMessageToParent("deleted");
            
        }

        const handleBlur = () => {
            setEditingCell(null);
        };
    
        const handleKeyDown = async (e) => {
            if (e.key === "Enter") {
                await updateRoomData(e);
                handleBlur();
                setData('');
                roomRefetch();
            } if (e.key == "Escape") {
                handleBlur();
                return;
            }
        };

        const handleOnMarkedRow = () => {
            if (markedRow === '') {
                setMarkedRow('marked-row');
            } else {
                setMarkedRow('');
            }   
        }

        const renderEditableCell = (cellName) => (
            <td className={cellClass} name={cellName} onClick={() => handleEdit(cellName)} style={{ cursor: 'pointer' }}>
            {editingCell === cellName && roomData ? (
                <input
                    type="text"
                    className="table-input"
                    value={roomData[cellName]}
                    onChange={(e) => handleChange(e, cellName)}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                    autoFocus
                />
            ) : (
                roomData ? roomData.room_data[cellName] : ''
            )}
        </td>   
        );
        
    return (
        <>
        {response && response.error ? <MessageBox message={response.error} /> : null}
        <tr className={markedRow}>
        <td className={cellClass} style={{ cursor: 'pointer' }} onClick={handleOnMarkedRow}>{index + 1}</td>
            <td className={cellClass}>{roomData ? roomData.room_data.BuildingName : ''}</td>
            <td className={cellClass}>{roomData ? roomData.room_data.Floor : ''}</td>
            {renderEditableCell("RoomNumber")}
            <td className={cellClass}>{roomData ? roomData.room_data.RoomTypeName : ''}</td>
            {renderEditableCell("RoomName")}
            {renderEditableCell("Area")}
            {renderEditableCell("RoomPopulation")}
            {renderEditableCell("Comment")}
            <td className={cellClass}>
                <button onClick={onDelete} className="table-button" disabled={disabledDeleteButton}>Slett</button>
            </td>
        </tr>
        </>
    );
}

export default RoomTableRowComponent;