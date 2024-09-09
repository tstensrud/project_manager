import { useEffect, useState, useContext } from "react";
import { useParams } from 'react-router-dom';
import { GlobalContext } from '../../GlobalContext';

// Hooks
import useSubmitData from '../../hooks/useSubmitData'
import useFetch from '../../hooks/useFetch'
import useUpdateData from '../../hooks/useUpdateData'
import useDeleteData from '../../hooks/useDeleteData'

// Components
import MessageBox from '../../layout/MessageBox';

// Svg
import MarkRowIcon from '../../assets/svg/MarkRowIcon.svg?react';


function RoomTableRowComponent({ roomId, totalColumns }) {
    const { projectId } = useParams();
    const { activeProject, setActiveProject, token, setToken } = useContext(GlobalContext);

    // Initial fetches
    const { data: roomData, loading: roomLoading, error: roomError, refetch: roomRefetch } = useFetch(`/project_api/${projectId}/rooms/get_room/${roomId}/`);

    // Update and delete
    const { data: updatedRoomData, response, setData, handleSubmit: updateRoomData } = useUpdateData(`/project_api/${projectId}/rooms/update_room/${roomId}/`);
    const { data: deleteRoomId, responseDeleteRoom, setData: setDeleteData, handleSubmit: deleteSubmit } = useDeleteData(`/project_api/${projectId}/rooms/delete_room/${roomId}/`);

    // Edit cells
    const [editingCell, setEditingCell] = useState(null);
    const [editedData, setEditedData] = useState(null);
    const [disabledDeleteButton, setDisabledDeleteButton] = useState(false);
    const [cellClass, setRowClass] = useState("");

    // Row marking
    const [markedRow, setMarkedRow] = useState('');

    // Undo
    const [undoButton, setUndoButton] = useState(false);
    const { data: undoDelete, response: undoDeleteResponse, setData: setUndoDeleteData, handleSubmit } = useSubmitData(`/project_api/${projectId}/rooms/undo_delete/${roomId}/`);

    // Use effects
    useEffect(() => {
        setActiveProject(projectId);
        setDeleteData({ "roomId": roomId });
    }, []);

    useEffect(() => {
        if (roomData) {
            setEditedData('');
        }
    }, [roomData]);

    // Handlers
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
        setUndoButton(true);
        setUndoDeleteData({ "undo": true });
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
    };

    const renderEditableCell = (cellName, width) => (
        <td width={width} className={cellClass} name={cellName} onClick={() => handleEdit(cellName)} style={{ cursor: 'pointer' }}>
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

    const handleUndo = async (e) => {
        await handleSubmit(e);
        setUndoButton(false);
        setRowClass("");

    }

    return (
        <>
            {response?.error && <MessageBox message={response.error} />}
            <tr className={markedRow}>
                {
                    roomLoading && roomLoading === true ? (
                        <>
                            {
                                Array.from({ length: totalColumns }).map((_, index) => (
                                    <td className="loading-text" key={index}>####</td>
                                ))
                            }
                        </>
                    ) : (
                        <>
                            <td width="2%" className={cellClass} style={{ cursor: 'pointer' }} onClick={handleOnMarkedRow}>
                                <MarkRowIcon />
                            </td>
                            <td width="12%" className={cellClass}>
                                {roomData ? roomData.room_data.BuildingName : ''}
                            </td>
                            {renderEditableCell("RoomNumber", "10%")}
                            <td width="15%" className={cellClass}>
                                {roomData ? roomData.room_data.RoomTypeName : ''}
                            </td>
                            {renderEditableCell("RoomName", "10%")}
                            {renderEditableCell("Area", "5%")}
                            {renderEditableCell("RoomPopulation", "5%")}
                            {renderEditableCell("Comments", "30%")}
                            <td className={cellClass} width="10%">
                                {
                                    undoButton ? <><button onClick={handleUndo} className="table-button">Angre</button></> : <><button onClick={onDelete} className="table-button" disabled={disabledDeleteButton}>Slett</button></>
                                }
                            </td>
                        </>
                    )
                }
            </tr>
        </>
    );
}

export default RoomTableRowComponent;