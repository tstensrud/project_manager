import { useEffect, useState, useContext } from "react";
import useDeleteData from '../../hooks/useDeleteData'

// Hooks
import useUpdateData from '../../hooks/useUpdateData'
import useFetch from '../../hooks/useFetch'

// Components
import MessageBox from '../../layout/MessageBox';

function EditSpecTableRow({ roomUid, totalColumns }) {

    // Initial room data fetch
    const { data: roomData, loading: roomLoading, error: roomDataError, refetch: roomRefetch } = useFetch(`/specifications/get_room_type_data/${roomUid}/`);

    // Update room type data and delete room
    const { data: updatedRoomData, response, setData, handleSubmit: updateRoomData } = useUpdateData(`/specifications/update_room/${roomUid}/`);
    const { data: deleteRoomId, responseDeleteRoom, setData: setDeleteData, handleSubmit: deleteSubmit } = useDeleteData(`/specifications/delete_room_type/${roomUid}/`);

    // Edit of cells
    const [editingCell, setEditingCell] = useState(null);
    const [editedData, setEditedData] = useState(null);
    const [disabledDeleteButton, setDisabledDeleteButton] = useState(false);
    const [cellClass, setRowClass] = useState("");

    // Marking a row
    const [markedRow, setMarkedRow] = useState('');

    // useEffects
    useEffect(() => {
        if (roomData) {
            setEditedData('');
        }
    }, [roomData]);

    // Use effects
    useEffect(() => {
        setDeleteData({ "roomId": roomUid });
    }, []);


    // Handlers
    const handleChange = (e, cellName) => {
        setData((prevData) => ({
            ...prevData,
            [cellName]: e.target.value,
        }));
    };

    const handleEdit = (cellName) => {
        setEditingCell(cellName);
    };

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

    const onDelete = async (e) => {
        await deleteSubmit(e);
        setDisabledDeleteButton(true);
        setRowClass("deleted-row")
        //setUndoButton(true);
        //setUndoDeleteData({"undo": true});
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
                    placeholder="..."
                    autoFocus
                />
            ) : (
                roomData ? roomData.data[cellName] : ''
            )}
        </td>
    );

    return (
        <>
            {response?.error && <MessageBox message={response.error} />}
            <tr>
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
                            {renderEditableCell("name")}
                            {renderEditableCell("air_per_person")}
                            {renderEditableCell("air_emission")}
                            {renderEditableCell("air_process")}
                            {renderEditableCell("air_minimum")}
                            {renderEditableCell("ventilation_principle")}
                            {renderEditableCell("heat_exchange")}
                            {renderEditableCell("room_control")}
                            {renderEditableCell("notes")}
                            {renderEditableCell("db_technical")}
                            {renderEditableCell("db_neighbour")}
                            {renderEditableCell("db_corridor")}
                            {renderEditableCell("comments")}
                            <td>
                                <button onClick={onDelete} className="table-button" disabled={disabledDeleteButton}>Slett</button>
                            </td>
                        </>
                    )
                }
            </tr>
        </>
    );
}

export default EditSpecTableRow;