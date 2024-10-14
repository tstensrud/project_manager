import { useEffect, useState, useContext } from "react";
import { GlobalContext } from '../../context/GlobalContext';

// Hooks
import useSubmitData from '../../hooks/useSubmitData'
import useUpdateData from '../../hooks/useUpdateData'
import useDeleteData from '../../hooks/useDeleteData'
import useFetchRequest from '../../hooks/useFetchRequest.jsx'

// Components
import MessageBox from '../../layout/MessageBox';
import LoadingRow from '../../layout/tableelements/LoadingRow.jsx';
import MarkedRow from "../../layout/tableelements/MarkedRow.jsx";
import EditableTableCell from "../../layout/tableelements/EditableTableCell.jsx";

// Svg
import MarkRowIcon from '../../assets/svg/MarkRowIcon.jsx';
import EditableInputField from "../../layout/tableelements/EditableInputField.jsx";
import TableTDelement from "../../layout/tableelements/TableTDelement.jsx";
import TableButton from "../../layout/tableelements/TableButton.jsx";


function RoomTableRowComponent({ totalColumns, roomData, roomTypeData, buildingData }) {
    const { activeProject } = useContext(GlobalContext);
    const [serverSuccesFalseMsg, setServerSuccesFalseMsg] = useState(null);

    // Initial fetches
    const { data: roomDataUpdated, loading: roomUpdateLoading, error: roomError, fetchData: getUpdatedRoomData } = useFetchRequest(activeProject ? `/project_api/${activeProject}/rooms/get_room/${roomData.uid}/` : null);

    // Update and delete
    const { response, setData, handleSubmit: updateRoomData } = useUpdateData(activeProject ? `/project_api/${activeProject}/rooms/update_room/${roomData.uid}/` : null);
    const { setData: setDeleteData, handleSubmit: deleteSubmit, response: deleteResponse } = useDeleteData(activeProject ? `/project_api/${activeProject}/rooms/delete_room/${roomData.uid}/` : null);

    // Edit cells
    const [editingCell, setEditingCell] = useState(null);

    // Row marking
    const [markedRow, setMarkedRow] = useState(false);

    // Undo and deletion
    const [deletedRoom, setDeletedRoom] = useState(false);
    const [undoButton, setUndoButton] = useState(false);
    const { setData: setUndoDeleteData, response: undoDeleteResponse, handleSubmit: handleUndoDelete } = useSubmitData(activeProject ? `/project_api/${activeProject}/rooms/undo_delete/${roomData.uid}/` : null);

    // Use effects
    useEffect(() => {
        setDeleteData({ roomId: roomData.uid });
    }, []);

    useEffect(() => {
        if (response?.success) {
            getUpdatedRoomData();
        } else if (response?.success === false) {
            setServerSuccesFalseMsg(response.message)
        }
        setData('');
    }, [response]);

    useEffect(() => {
        if (deleteResponse?.success === true) {
            setUndoButton(true);
            setUndoDeleteData({ "undo": true });
            setDeletedRoom(true);
        }
    }, [deleteResponse]);

    useEffect(() => {
        if (undoDeleteResponse?.success === true) {
            setUndoButton(false);
            setDeletedRoom(false);
        }
    }, [undoDeleteResponse])

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

    const handleDelete = async (e) => {
        e.preventDefault();
        await deleteSubmit();
    }

    const handleBlur = () => {
        setEditingCell(null);
    };

    const handleKeyDown = async (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            await updateRoomData();
            handleBlur();
        } if (e.key == "Escape") {
            handleBlur();
            return;
        }
    };

    const handleOnMarkedRow = () => {
        if (markedRow === false) {
            setMarkedRow(true)
        } else {
            setMarkedRow(false);
        }
    };

    const renderEditableCell = (cellName, width) => (
        <TableTDelement pointer={true} width={width} name={cellName} clickFunction={() => handleEdit(cellName)}>
            {
                editingCell === cellName ? (
                    <EditableInputField changeFunction={(e) => handleChange(e, cellName)} blur={handleBlur} keyDown={handleKeyDown} />
                ) : (
                    <EditableTableCell>
                        {!roomDataUpdated ? roomData[cellName] : roomDataUpdated.data.roomData[cellName]}
                    </EditableTableCell>
                )
            }
        </TableTDelement>
    );

    const handleUndo = async (e) => {
        e.preventDefault();
        await handleUndoDelete();
    }

    return (
        <>
            {serverSuccesFalseMsg && <MessageBox setServerSuccesFalseMsg={setServerSuccesFalseMsg} closeable={true} message={serverSuccesFalseMsg} />}
            {roomError && <MessageBox message={roomError} closeable={true} />}
            <MarkedRow deleted={deletedRoom} markedRow={markedRow}>

                {
                    roomData ? (
                        <>
                            {
                                roomUpdateLoading ? (
                                    <LoadingRow cols={totalColumns} />
                                ) : (
                                    <>
                                        <TableTDelement width="2%" clickFunction={handleOnMarkedRow}>
                                            <MarkRowIcon />
                                        </TableTDelement>

                                        <TableTDelement width="12%">
                                            {buildingData.BuildingName}
                                        </TableTDelement>

                                        {renderEditableCell("RoomNumber", "10%")}
                                        <TableTDelement width="15%">
                                            {roomTypeData.name}
                                        </TableTDelement>
                                        {renderEditableCell("RoomName", "10%")}
                                        {renderEditableCell("Area", "5%")}
                                        {renderEditableCell("RoomPopulation", "5%")}
                                        {renderEditableCell("Comments", "30%")}
                                        <TableTDelement width="10%">
                                            <div className="pt-1 pb-1">
                                                {
                                                    undoButton ?
                                                        <TableButton clickFunction={handleUndo} buttonText="Angre" disabled={false} />
                                                        :
                                                        <TableButton clickFunction={handleDelete} buttonText="Slett" />
                                                }
                                            </div>
                                        </TableTDelement>
                                    </>
                                )
                            }

                        </>
                    ) : (
                        <td colspan={totalColumns} className="text-center">En feil har oppstått. Prøve igjen og kontakt admin ved vedvarende feil.</td>
                    )
                }
            </MarkedRow>
        </>
    );
}

export default RoomTableRowComponent;