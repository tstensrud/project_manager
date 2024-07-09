import { useEffect, useState, useContext } from "react";
import { useParams } from 'react-router-dom';
import { GlobalContext } from '../../GlobalContext';

import useFetch from '../../hooks/useFetch'
import useSubmitData from "../../hooks/useSubmitData";
import useUpdateData from '../../hooks/useUpdateData'
import useDeleteData from '../../hooks/useDeleteData'

import MessageBox from '../../layout/MessageBox';



function SystemTableRowComponent({systemId, msgToParent}) {
        const {projectId} = useParams();
        const { activeProject, setActiveProject, token, setToken } = useContext(GlobalContext);

        // Hooks
        const {data: systemData, loading: systemLoading, error: systemError, refetch: systemRefetch} = useFetch(`/project_api/${projectId}/get_system/${systemId}/`);
        const {data: updatedSystemData, response, setData, handleSubmit: updateSystemData} = useUpdateData(`/project_api/${projectId}/update_system/${systemId}/`);
        const {data: deleteSystemId, responseDeleteSystem, setData: setDeleteData, handleSubmit: deleteSubmit} = useDeleteData(`/project_api/${projectId}/delete_system/${systemId}/`);
        
        // Use states
        const [editingCell, setEditingCell] = useState(null);
        const [editedData, setEditedData] = useState(null);
        const [disabledDeleteButton, setDisabledDeleteButton] = useState(false);
        const [cellClass, setRowClass] = useState("");
        const [markedRow, setMarkedRow] = useState('');

        // use effects
        useEffect(() => {
            setActiveProject(projectId);
            setDeleteData({"roomId": systemId});
        },[]);

        useEffect(() => {
            if(systemData) {
                //setEditedData({ ...roomData });
                setEditedData('');
            }
        },[systemData]);


        // Handlers
        const sendMessageToParent = (msg) => {
            msgToParent(msg);
        }

        const handleEdit = (cellName) => {
            setEditingCell(cellName);
        };
    
        const handleChange = (e, cellName) => {
            //setEditedData((prevData) => ({
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
        
        if (response && response.error !== null && response.error !== undefined) return (<><MessageBox message={response.error} /></>);
    return (
        <>
        <tr className={markedRow}>
        <td className={cellClass}  style={{ cursor: 'pointer' }} onClick={handleOnMarkedRow}>#</td>
            <td className={cellClass}>{systemData ? systemData.system_data.SystemName : ''}</td>
            {renderEditableCell("Location")}
            {renderEditableCell("ServiceArea")}
            {renderEditableCell("AirFlow")}
            {renderEditableCell("HeatExchange")}
            <td className={cellClass}>{systemData ? systemData.system_data.AirFlowSupply : ''}</td>
            <td className={cellClass}>{systemData ? systemData.system_data.AirFlowExtract : ''}</td>
            <td className={cellClass}>{systemData ? systemData.system_data.SpecialSystem : ''}</td>
            <td className={cellClass}>
                {systemData && systemData.system_data.AirFlowSupply !== systemData.system_data.AirFlowExtract ? (<>Ubalanse på system. </>) : (<></>)}
                {systemData && systemData.system_data.AirFlowSupply > systemData.system_data.AirFlow ? (<>For mye tilluft. </>) : (<></>)}
                {systemData && systemData.system_data.AirFlowExtract > systemData.system_data.AirFlow ? (<>For mye avtrekk. </>) : (<></>)}
            </td>
            <td className={cellClass}>
                <button onClick={onDelete} className="table-button" disabled={disabledDeleteButton}>Slett</button>
            </td>
        </tr>
        </>
    );
}

export default SystemTableRowComponent;