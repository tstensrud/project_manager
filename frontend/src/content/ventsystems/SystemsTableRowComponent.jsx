import { useEffect, useState, useContext } from "react";

// Hooks
import useFetch from '../../hooks/useFetch'
import useUpdateData from '../../hooks/useUpdateData';
import useDeleteData from '../../hooks/useDeleteData';
import { GlobalContext } from '../../context/GlobalContext';

// Components
import MessageBox from '../../layout/MessageBox';
import DeleteBox from './DeleteBox';
import TableTDelement from "../../layout/tableelements/TableTDelement.jsx";
import EditableInputField from "../../layout/tableelements/EditableInputField.jsx";
import TableButton from "../../layout/tableelements/TableButton.jsx";
import MarkedRow from "../../layout/tableelements/MarkedRow.jsx";
import LoadingRow from '../../layout/tableelements/LoadingRow.jsx'

// SVG
import MarkRowIcon from '../../assets/svg/MarkRowIcon.jsx';

function SystemTableRowComponent({ systemId, systemsRefetch, cols }) {
    const { activeProject } = useContext(GlobalContext);
    const [serverSuccesFalseMsg, setServerSuccesFalseMsg] = useState(null);

    // Hooks
    const { data: systemData, loading: systemLoading, error: systemError, refetch: systemRefetch } = useFetch(`/project_api/${activeProject}/get_system/${systemId}/`);
    const { response: updateSystemDataResponse, setData, handleSubmit: updateSystemData } = useUpdateData(`/project_api/${activeProject}/update_system/${systemId}/`);
    const { response: responseDeleteSystem, setData: setDeleteData, handleSubmit: deleteSubmit } = useDeleteData(`/project_api/${activeProject}/delete_system/${systemId}/`);

    // Use states
    const [editingCell, setEditingCell] = useState(null);
    const [markedRow, setMarkedRow] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    // use effects
    useEffect(() => {
        setDeleteData({ "roomId": systemId });
    }, []);

    useEffect(() => {
        if (responseDeleteSystem?.success) {
            systemsRefetch();
        } else if(responseDeleteSystem?.success === false) {
            setServerSuccesFalseMsg(responseDeleteSystem.message)
        }
    }, [responseDeleteSystem]);

    useEffect(() => {
        if (updateSystemDataResponse?.success) {
            systemRefetch();
        } else if (updateSystemDataResponse?.success === false) {
            setServerSuccesFalseMsg(updateSystemDataResponse.message);
        }
        setData('');
    }, [updateSystemDataResponse]);

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

    const showDeleteBox = async (e) => {
        e.preventDefault();
        setShowDeleteDialog(true);
    }

    const deleteSystem = async (e) => {
        e.preventDefault();
        await deleteSubmit();
    }

    const handleBlur = () => {
        setEditingCell(null);
    };

    const handleKeyDown = async (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            await updateSystemData();
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
            {serverSuccesFalseMsg&& (<MessageBox setServerSuccesFalseMsg={setServerSuccesFalseMsg} closeable={true} message={serverSuccesFalseMsg} />)}
            {
                systemLoading ? (
                    <LoadingRow cols={cols}/>
                ) : (
                    <MarkedRow markedRow={markedRow}>
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
                                showDeleteDialog &&  <DeleteBox systemName={systemData && systemData.system_data.SystemName} setShowDeleteDialog={setShowDeleteDialog} deleteSystem={deleteSystem} />
                            }
                            {systemData && systemData.system_data.AirFlowSupply !== systemData.system_data.AirFlowExtract ? (<>Ubalanse på system. </>) : (<></>)}
                            {systemData && systemData.system_data.AirFlowSupply > systemData.system_data.AirFlow ? (<>For mye tilluft. </>) : (<></>)}
                            {systemData && systemData.system_data.AirFlowExtract > systemData.system_data.AirFlow ? (<>For mye avtrekk. </>) : (<></>)}
                        </TableTDelement>
                        <TableTDelement width="10%">
                            <div className="pt-1 pb-1">
                                {showDeleteDialog && (<TableButton clickFunction={showDeleteBox} buttonText="Slett" />)}
                            </div>
                        </TableTDelement>
                    </MarkedRow>
                )
            }
        </>
    );
}

export default SystemTableRowComponent;