import { useEffect, useState, useContext } from "react";
import { useParams } from 'react-router-dom';
import { GlobalContext } from '../../GlobalContext';

import RoomData from './RoomData';
import MessageBox from '../../layout/MessageBox';
import useFetch from '../../hooks/useFetch';
import useUpdateData from '../../hooks/useUpdateData';
import useUpdateSystem from '../../hooks/useUpdateSystem';


function RoomTableRowComponent({roomId, msgToParent, systems, index}) {
        const {projectId} = useParams();
        const { activeProject, setActiveProject, token, setToken } = useContext(GlobalContext);

        
        // Initial fetches and refetch
        const {data: roomData, loading: roomLoading, error: roomError} = useFetch(`/project_api/${projectId}/rooms/get_room/${roomId}/`);
        const {data: ventData, loading: ventLoading, error: ventError, refetch: ventRefetch} = useFetch(`/project_api/${projectId}/ventilation/get_room/${roomId}/`);
        
        // Update data
        const {data: updatedRoomData, response, setData, handleSubmit: updateRoomData} = useUpdateData(`/project_api/${projectId}/ventilation/update_room/${roomId}/`);
        const {systemData, response: systemResponse, setSystemData, handleSubmit: updateSystemData} = useUpdateSystem(`/project_api/${projectId}/ventilation/update_room/${roomId}/`);
        
        // Edit of values
        const [editingCell, setEditingCell] = useState(null);
        const [editedData, setEditedData] = useState(null);
        const [currentSystemId, setCurrentSystemId] = useState('');
        const [currentSystemName, setCurrentSystemName] = useState('');

        // Marking a row
        const [markedRow, setMarkedRow] = useState('');

        // Roomdata
        const [showRoomData, setShowRoomData] = useState(false);
        const [test, setTest] = useState(false);

        // useEffects
        useEffect(() => {
            setActiveProject(projectId);
        },[]);

        useEffect(() => {
            if(ventData) {
                setEditedData('');
            }
            if (ventData && ventData.vent_data) {
                setCurrentSystemId(ventData.vent_data.SystemId);
                setCurrentSystemName(ventData.vent_data.SystemName);
            }
        },[ventData]);

        useEffect(() => {
            if (systemData !== null) {
                if (currentSystemId !== systemData) {
                    updateSystemData();
                    setSystemData(null);
                    //ventRefetch();
                }
            }
        }, [systemData]);

        useEffect(() => {
            ventRefetch();
        }, [systemResponse]);
        
        // Handlers
        const handleRoomDataClick = (e) => {
            e.preventDefault();
            setShowTodoList(!showTodoList);
        }

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
                ventRefetch();
                sendMessageToParent("updateSummaries");
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

        const renderEditableCell = (cellName, cellClass) => (
            <td className={cellClass} name={cellName} onClick={() => handleEdit(cellName)} style={{ cursor: 'pointer' }}>
            {editingCell === cellName && ventData ? (
                <input
                    type="text"
                    className="table-input"
                    value={ventData[cellName]}
                    onChange={(e) => handleChange(e, cellName)}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                    autoFocus
                />
            ) : (
                ventData ? ventData.vent_data[cellName] : ''
            )}
        </td>   
        );

        const handleSystemChange = (e) => {
            const newSystemData = {[e.target.name]: e.target.value}
            setSystemData(newSystemData);
        };

        const handleOpenRoomData = (e) => {
            e.preventDefault();
            setShowRoomData(!showRoomData);
        }

    return (
        <>
        {showRoomData ? <RoomData roomData={roomData} ventData={ventData} showRoomData={showRoomData} setShowRoomData={setShowRoomData}/> : ''}
        {response && response.error ? <MessageBox message={response.error} /> : null}
        <tr className={markedRow}>
            <td style={{ cursor: 'pointer' }} onClick={handleOnMarkedRow}>{index + 1}</td>
            <td>{roomData ? roomData.room_data.Floor : ''}</td>
            <td onClick={(e) => handleOpenRoomData(e, setShowRoomData)} style={{ cursor: 'pointer' }}>
                <strong>{roomData ? roomData.room_data.RoomNumber : ''}</strong>
                <br />
                <span className="table-text-grey">{roomData ? roomData.room_data.RoomName : ''}</span>
            </td>
            <td>{ventData ? (ventData.vent_data.AirPersonSum).toFixed(0) : ''} </td>
            <td>{ventData ? (ventData.vent_data.AirEmissionSum).toFixed(0) : ''}</td>
            <td>{ventData ? ventData.vent_data.AirProcess : ''}</td>
            <td>{ventData ? ventData.vent_data.AirMinimum : ''}</td>
            <td>{ventData ? (ventData.vent_data.AirDemand).toFixed(0) : ''}</td>
            {renderEditableCell("AirSupply", "supplyCell")}
            {renderEditableCell("AirExtract", "extractCell")}
            <td>{ventData ? ventData.vent_data.AirChosen : ''}</td>
            <td>{(ventData && roomData) ? (ventData.vent_data.AirMinimum * roomData.room_data.Area).toFixed(0) : '' }</td>
            <td>
                <select value={currentSystemName} name="systemUid" className="table-select" onChange={handleSystemChange}>
                    {currentSystemName && currentSystemName !== null ? (<option key="0">{currentSystemName}</option>) : ''}
                    {systems && Object.keys(systems.systems_data).map((key, index) => (
                        <option key={index} value={systems.systems_data[key].uid}>{systems.systems_data[key].SystemName}</option>
                    ))}
                </select>
            </td>
            <td>
                {ventData && ventData.vent_data.AirDemand > ventData.vent_data.AirSupply ? (<>For lite luft. </>): (<></>)}
                {ventData && ventData.vent_data.AirSupply !== ventData.vent_data.AirExtract ? (<>Ubalanse i rom</>):(<></>)}
            </td>
        </tr>
        </>
    );
}

export default RoomTableRowComponent;