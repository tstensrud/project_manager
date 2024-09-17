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
import LoadingRow from '../../layout/tableelements/LoadingRow.jsx';

// Svg
import MarkRowIcon from '../../assets/svg/MarkRowIcon.jsx';
import EditableInputField from "../../layout/tableelements/EditableInputField.jsx";
import TableTDelement from "../../layout/tableelements/TableTDelement.jsx";
import TableButton from "../../layout/tableelements/TableButton.jsx";


function RoomTableRowComponent({ roomId, totalColumns }) {
    const { projectId } = useParams();
    const { setActiveProject } = useContext(GlobalContext);

    // Initial fetches
    const { data: roomData, loading: roomLoading, error: roomError, refetch: roomRefetch } = useFetch(`/project_api/${projectId}/rooms/get_room/${roomId}/`);

    // Update and delete
    const {  response, setData, handleSubmit: updateRoomData } = useUpdateData(`/project_api/${projectId}/rooms/update_room/${roomId}/`);
    const {  setData: setDeleteData, handleSubmit: deleteSubmit } = useDeleteData(`/project_api/${projectId}/rooms/delete_room/${roomId}/`);

    // Edit cells
    const [editingCell, setEditingCell] = useState(null);

    // Row marking
    const [markedRow, setMarkedRow] = useState('');

    // Undo
    const [undoButton, setUndoButton] = useState(false);
    const { setData: setUndoDeleteData, handleSubmit } = useSubmitData(`/project_api/${projectId}/rooms/undo_delete/${roomId}/`);

    // Use effects
    useEffect(() => {
        setActiveProject(projectId);
        setDeleteData({ "roomId": roomId });
    }, []);


    useEffect(() => {
        if (response?.success === true) {
            setData('');
            roomRefetch();
        }
    },[response]);

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
        } if (e.key == "Escape") {
            handleBlur();
            return;
        }
    };

    const handleOnMarkedRow = () => {
        if (markedRow === '') {
            setMarkedRow('bg-marked-row dark:bg-dark-marked-row text-primary-color dark:text-dark-primary-color');
        } else {
            setMarkedRow('');
        }
    };

    const renderEditableCell = (cellName, width) => (
        <TableTDelement pointer={true} width={width} name={cellName} clickFunction={() => handleEdit(cellName)}>
            {
                editingCell === cellName && roomData ? (
                    <EditableInputField value={roomData[cellName]} changeFunction={(e) => handleChange(e, cellName)} blur={handleBlur} keyDown={handleKeyDown} />
                ) : (
                    roomData ? roomData.room_data[cellName] : ''
                )
            }
        </TableTDelement>
    );

    const handleUndo = async (e) => {
        await handleSubmit(e);
        setUndoButton(false);
    }

    return (
        <>
            {response?.success === false && <MessageBox message={response.message} />}
            <tr className={undoButton ? 'text-grey-text line-through' : `${markedRow} hover:bg-table-hover hover:dark:bg-dark-table-hover`}>
                {
                    roomLoading && roomLoading === true ? (
                        <LoadingRow cols={totalColumns} />
                    ) : (
                        <>
                            <TableTDelement width="2%" clickFunction={handleOnMarkedRow}>
                                <MarkRowIcon />
                            </TableTDelement>

                            <TableTDelement width="12%">
                                {roomData ? roomData.room_data.BuildingName : ''}
                            </TableTDelement>

                            {renderEditableCell("RoomNumber", "10%")}
                            <TableTDelement width="15%">
                                {roomData ? roomData.room_data.RoomTypeName : ''}
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
                                    <TableButton clickFunction={onDelete} buttonText="Slett" />
                                }
                                </div>
                            </TableTDelement>
                        </>
                    )
                }
            </tr>
        </>
    );
}

export default RoomTableRowComponent;