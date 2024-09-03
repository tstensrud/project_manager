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

// SVG
import MarkRowIcon from '../../assets/svg/MarkRowIcon.svg?react';

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
            setMarkedRow('marked-row');
        } else {
            setMarkedRow('');
        }
    }

    const renderEditableCell = (cellName) => (
        <td className={cellClass} name={cellName} onClick={() => handleEdit(cellName)} style={{ cursor: 'pointer' }}>
            {editingCell === cellName && systemData ? (

                <input
                    type="text"
                    className="table-input"
                    value={systemData[cellName]}
                    onChange={(e) => handleChange(e, cellName)}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                    autoFocus
                />
            ) : (
                systemData ? systemData.system_data[cellName] : ''
            )}
        </td>
    );

    return (
        <>
            {response && response.error !== null && response.error !== undefined ? (<MessageBox message={response.error} />) : (<></>)}

            <tr className={markedRow}>

                {
                    systemLoading && systemLoading === true ? (
                        <>
                            {
                                Array.from({ length: totalColumns }).map((_, index) => (
                                    <td className="loading-text">###</td>
                                ))
                            }
                        </>
                    ) : (
                        <>
                            <td className={cellClass} style={{ cursor: 'pointer' }} onClick={handleOnMarkedRow}><MarkRowIcon /></td>
                            <td className={cellClass}>{systemData ? systemData.system_data.SystemName : ''}</td>
                            {renderEditableCell("Location")}
                            {renderEditableCell("ServiceArea")}
                            {renderEditableCell("AirFlow")}
                            {renderEditableCell("HeatExchange")}
                            <td className={cellClass}>{systemData ? systemData.system_data.AirFlowSupply : ''}</td>
                            <td className={cellClass}>{systemData ? systemData.system_data.AirFlowExtract : ''}</td>
                            <td className={cellClass}>{systemData ? systemData.system_data.SpecialSystem : ''}</td>
                            <td className={cellClass}>
                                {
                                    showDeleteDialog === true ? (
                                        <DeleteBox systemName={systemData && systemData.system_data.SystemName} setShowDeleteDialog={setShowDeleteDialog} deleteSystem={deleteSystem} />
                                    ) : (<></>)
                                }
                                {systemData && systemData.system_data.AirFlowSupply !== systemData.system_data.AirFlowExtract ? (<>Ubalanse på system. </>) : (<></>)}
                                {systemData && systemData.system_data.AirFlowSupply > systemData.system_data.AirFlow ? (<>For mye tilluft. </>) : (<></>)}
                                {systemData && systemData.system_data.AirFlowExtract > systemData.system_data.AirFlow ? (<>For mye avtrekk. </>) : (<></>)}
                            </td>
                            <td className={cellClass}>
                                {showDeleteDialog === true ? (<></>) : (<button onClick={showDeleteBox} className="table-button" disabled={disabledDeleteButton}>Slett</button>)}
                            </td>
                        </>
                    )
                }
            </tr>
        </>
    );
}

export default SystemTableRowComponent;