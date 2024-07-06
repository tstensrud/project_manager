import { useEffect, useState, useContext } from "react";
import { useParams } from 'react-router-dom';
import { GlobalContext } from '../../GlobalContext';

import MessageBox from '../../layout/MessageBox';
import useFetch from '../../hooks/useFetch';
import useUpdateData from '../../hooks/useUpdateData';


function HeatingTableRowComponent({roomId, msgToParent}) {
        const {projectId} = useParams();
        const { activeProject, setActiveProject, token, setToken } = useContext(GlobalContext);

        
        // Initial fetches and refetch
        const {data: heatingData, loading: heatingLoading, error: heatingError, refetch: heatingRefetch} = useFetch(`/project_api/${projectId}/heating/get_room/${roomId}/`);
        
        // Update data
        const {data: updatedRoomData, response, setData, handleSubmit: updateRoomData} = useUpdateData(`/project_api/${projectId}/heating/update_room/${roomId}/`);
        
        // Edit of values
        const [editingCell, setEditingCell] = useState(null);
        const [editedData, setEditedData] = useState(null);

        // Marking a row
        const [markedRow, setMarkedRow] = useState('');

        // useEffects
        useEffect(() => {
            setActiveProject(projectId);
        },[]);

        useEffect(() => {
            if(heatingData) {
                setEditedData('');
            }
        },[heatingData]);
        
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

        const handleBlur = () => {
            setEditingCell(null);
        };
    
        const handleKeyDown = async (e) => {
            if (e.key === "Enter") {
                await updateRoomData(e);
                handleBlur();
                setData('');
                heatingRefetch();
                //sendMessageToParent("updateSummaries");
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
            <td name={cellName} onClick={() => handleEdit(cellName)}>
            {editingCell === cellName && heatingData ? (
                <input
                    type="text"
                    className="table-input"
                    value={heatingData[cellName]}
                    onChange={(e) => handleChange(e, cellName)}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                    autoFocus
                />
            ) : (
                heatingData ? heatingData.heating_data[cellName] : ''
            )}
        </td>   
        );

    return (
        <>
        {response && response.error !== null && response.error !== undefined ? (<><MessageBox message={response.error} /></>) : (<></>)}

        <tr className={markedRow}>
        <td style={{ cursor: 'pointer' }} onClick={handleOnMarkedRow}>#</td>
            <td>{heatingData ? heatingData.room_data.RoomNumber : ''}</td>
            {renderEditableCell("RoomHeight")}
            {renderEditableCell("OuterWallArea")}
            {renderEditableCell("InnerWallArea")}
            {renderEditableCell("WindowDoorArea")}
            {renderEditableCell("RoofArea")}
            {renderEditableCell("FloorGroundArea")}
            {renderEditableCell("FloorAirArea")}
            <td>{heatingData ? heatingData.heating_data.Airflow : ''}</td>
            <td>{heatingData ? heatingData.heating_data.HeatLossSum : ''}</td>
            {renderEditableCell("ChosenHeating")}
            <td>{heatingData && heatingData ? (heatingData.heating_data.ChosenHeating / heatingData.room_data.Area).toFixed(1): ''}</td>
            {renderEditableCell("HeatSource")}
            <td>
                {heatingData && heatingData.heating_data.ChosenHeating < heatingData.heating_data.HeatLossSum ? (<>For lite valgt varme</>) : (<></>)}
            </td>
        </tr>
        </>
    );
}

export default HeatingTableRowComponent;