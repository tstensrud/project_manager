import { useEffect, useState, useContext } from "react";
import { useParams } from 'react-router-dom';
import { GlobalContext } from '../../GlobalContext';

// Hooks
import useFetch from '../../hooks/useFetch'
import useSubmitData from "../../hooks/useSubmitData";
import useUpdateData from '../../hooks/useUpdateData';
import useDeleteData from '../../hooks/useDeleteData';

// Components
import MessageBox from '../../layout/MessageBox';
import DeleteBox from './DeleteBox';
import TableTDelement from "../../layout/tableelements/TableTDelement.jsx";
import EditableInputField from "../../layout/tableelements/EditableInputField.jsx";
import TableButton from "../../layout/tableelements/TableButton.jsx";

// SVG
import MarkRowIcon from '../../assets/svg/MarkRowIcon.jsx';

function SystemTableRowComponent({ systemId, msgToParent, totalColumns }) {
    const { projectId } = useParams();
    const { activeProject, setActiveProject, token, setToken } = useContext(GlobalContext);

    // Hooks
    const { data: systemData, loading: systemLoading, error: systemError, refetch: systemRefetch } = useFetch(`/project_api/${projectId}/get_system/${systemId}/`);
    const { data: updatedSystemData, response, setData, handleSubmit: updateSystemData } = useUpdateData(`/project_api/${projectId}/update_system/${systemId}/`);
    const { data: deleteSystemId, responseDeleteSystem, setData: setDeleteData, handleSubmit: deleteSubmit } = useDeleteData(`/project_api/${projectId}/delete_system/${systemId}/`);

    // Use states
    const [editingCell, setEditingCell] = useState(null);
    const [editedData, setEditedData] = useState(null);
    const [disabledDeleteButton, setDisabledDeleteButton] = useState(false);
    const [cellClass, setRowClass] = useState("");
    const [markedRow, setMarkedRow] = useState('');
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    // use effects
    useEffect(() => {
        setDeleteData({ "roomId": systemId });
    }, []);

    useEffect(() => {
        if (systemData) {
            setEditedData('');
        }
    }, [systemData]);


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

    const showDeleteBox = async (e) => {
        e.preventDefault();
        setShowDeleteDialog(true);
    }

    const deleteSystem = async (e) => {
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
            await updateSystemData(e);
            handleBlur();
            setData('');
            systemRefetch();
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
    }

    const renderEditableCell = (cellName, width) => (
        <TableTDelement pointer={true} width={width} name={cellName} clickFunction={() => handleEdit(cellName)}>
            {
                editingCell === cellName && systemData ? (
                    <EditableInputField value={systemData[cellName]} changeFunction={(e) => handleChange(e, cellName)} blur={handleBlur} keyDown={handleKeyDown} />
                ) : (
                    systemData ? systemData.system_data[cellName] : ''
                )
            }
        </TableTDelement>
    );

    return (
        <>
            {response && response.error !== null && response.error !== undefined ? (<MessageBox message={response.error} />) : (<></>)}

            <tr className={`${markedRow} hover:bg-table-hover hover:dark:bg-dark-table-hover`}>

                {
                    systemLoading && systemLoading === true ? (
                        <>
                            {
                                Array.from({ length: totalColumns }).map((_, index) => (
                                    <td className="blur-sm opacity-50">###</td>
                                ))
                            }
                        </>
                    ) : (
                        <>
                            <TableTDelement width="2%" clickFunction={handleOnMarkedRow}>
                                <MarkRowIcon />
                            </TableTDelement>
                            <TableTDelement width="5%">
                                {systemData ? systemData.system_data.SystemName : ''}
                            </TableTDelement>
                            {renderEditableCell("Location", "10%")}
                            {renderEditableCell("ServiceArea", "10%")}
                            {renderEditableCell("AirFlow", "7%")}
                            {renderEditableCell("HeatExchange", "5%")}
                            <TableTDelement width="7%">
                                {systemData ? systemData.system_data.AirFlowSupply : ''}
                            </TableTDelement>
                            <TableTDelement width="7%">
                                {systemData ? systemData.system_data.AirFlowExtract : ''}
                            </TableTDelement>
                            <TableTDelement width="5%">
                                {systemData ? systemData.system_data.SpecialSystem : ''}
                            </TableTDelement>
                            <TableTDelement width="32%">
                                {
                                    showDeleteDialog === true ? (
                                        <DeleteBox systemName={systemData && systemData.system_data.SystemName} setShowDeleteDialog={setShowDeleteDialog} deleteSystem={deleteSystem} />
                                    ) : (<></>)
                                }
                                {systemData && systemData.system_data.AirFlowSupply !== systemData.system_data.AirFlowExtract ? (<>Ubalanse på system. </>) : (<></>)}
                                {systemData && systemData.system_data.AirFlowSupply > systemData.system_data.AirFlow ? (<>For mye tilluft. </>) : (<></>)}
                                {systemData && systemData.system_data.AirFlowExtract > systemData.system_data.AirFlow ? (<>For mye avtrekk. </>) : (<></>)}
                            </TableTDelement>
                            <TableTDelement width="10%">
                                {showDeleteDialog === true ? (<></>) : (<TableButton clickFunction={showDeleteBox} buttonText="Slett" />)}
                            </TableTDelement>
                        </>
                    )
                }
            </tr>
        </>
    );
}

export default SystemTableRowComponent;