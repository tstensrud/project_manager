import { useEffect, useState } from "react";
import useDeleteData from '../../hooks/useDeleteData'

// Hooks
import useUpdateData from '../../hooks/useUpdateData'
import useFetch from '../../hooks/useFetch'

// Components
import MessageBox from '../../layout/MessageBox';
import EditableInputField from "../../layout/tableelements/EditableInputField.jsx";
import TableTDelement from "../../layout/tableelements/TableTDelement.jsx";
import TableButton from "../../layout/tableelements/TableButton.jsx";

function EditSpecTableRow({ roomUid, totalColumns, refetch }) {

    // Initial room data fetch
    const { data: roomData, loading: roomLoading, error: roomDataError, refetch: roomRefetch } = useFetch(`/specifications/get_room_type_data/${roomUid}/`);

    // Update room type data and delete room
    const { data: updatedRoomData, response: updateRoomDataResponse, setData, handleSubmit: updateRoomData } = useUpdateData(`/specifications/update_room/${roomUid}/`);
    const { data: deleteRoomId, response: responseDeleteRoom, setData: setDeleteData, handleSubmit: deleteSubmit } = useDeleteData(`/specifications/delete_room_type/${roomUid}/`);

    // Edit of cells
    const [editingCell, setEditingCell] = useState(null);
    const [editedData, setEditedData] = useState(null);
    const [disabledDeleteButton, setDisabledDeleteButton] = useState(false);

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

    useEffect(() => {
        if (responseDeleteRoom?.success === true) {
            refetch();
        }
    }, [responseDeleteRoom]);

    useEffect(() => {
        if (updateRoomDataResponse?.success === true) {
            setData('');
            roomRefetch();
        }
    }, [updateRoomDataResponse])

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

        } if (e.key == "Escape") {
            handleBlur();
            return;
        }
    };

    const onDelete = async (e) => {
        await deleteSubmit(e);
        setDisabledDeleteButton(true);
    }

    const renderEditableCell = (cellName, width) => (
        <TableTDelement pointer={true} width={width} name={cellName} clickFunction={() => handleEdit(cellName)}>
            {
                editingCell === cellName && roomData ? (
                    <EditableInputField value={roomData[cellName]} changeFunction={(e) => handleChange(e, cellName)} blur={handleBlur} keyDown={handleKeyDown} />
                ) : (
                    roomData ? roomData.data[cellName] : ''
                )
            }
        </TableTDelement>
    );

    return (
        <>
            {updateRoomDataResponse?.error && <MessageBox message={updateRoomDataResponse.error} />}
            <tr className="hover:bg-table-hover hover:dark:bg-dark-table-hover">
                {
                    roomLoading ? (
                        <>
                            {
                                Array.from({ length: totalColumns }).map((_, index) => (
                                    <td className="blur-sm opacity-50" key={index}>####</td>
                                ))
                            }
                        </>
                    ) : (
                        <>
                            {renderEditableCell("name", "15%")}
                            {renderEditableCell("air_per_person", "5%")}
                            {renderEditableCell("air_emission", "5%")}
                            {renderEditableCell("air_process", "5%")}
                            {renderEditableCell("air_minimum", "5%")}
                            {renderEditableCell("ventilation_principle", "5%")}
                            {renderEditableCell("heat_exchange", "5%")}
                            {renderEditableCell("room_control", "5%")}
                            {renderEditableCell("notes", "25%")}
                            {renderEditableCell("db_technical", "5%")}
                            {renderEditableCell("db_neighbour", "5%")}
                            {renderEditableCell("db_corridor", "5%")}
                            {renderEditableCell("comments", "5%")}
                            <TableTDelement width="5%">
                                <TableButton clickFunction={onDelete} buttonText="Slett" />
                            </TableTDelement>
                        </>
                    )
                }
            </tr>
        </>
    );
}

export default EditSpecTableRow;