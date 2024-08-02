import { useEffect, useState, useContext } from "react";
import { useParams } from 'react-router-dom';
import { GlobalContext } from '../../GlobalContext';

import RoomData from './RoomData';
import MessageBox from '../../layout/MessageBox';
import useFetch from '../../hooks/useFetch';
import useUpdateData from '../../hooks/useUpdateData';


function HeatingTableRowComponent({roomId, msgToParent, settingsUpdateState, totalColumns }) {
        const {projectId} = useParams();
        const { setActiveProject } = useContext(GlobalContext);

        
        // Initial fetches and refetch
        const {data: heatingData, loading: heatingLoading, refetch: heatingRefetch} = useFetch(`/project_api/${projectId}/heating/get_room/${roomId}/`);
        
        // Update data
        const {data: updatedRoomData, response, setData, handleSubmit: updateRoomData} = useUpdateData(`/project_api/${projectId}/heating/update_room/${roomId}/`);
        
        // Edit of values
        const [editingCell, setEditingCell] = useState(null);
        const [editedData, setEditedData] = useState(null);

        // Marking a row
        const [markedRow, setMarkedRow] = useState('');

        // Room data
        const [showRoomData, setShowRoomData] = useState(false);

        // useEffects
        useEffect(() => { // Refetch upon received message theat heating settings has changed
            heatingRefetch();
        },[settingsUpdateState]);

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

        const handleOpenRoomData = (e) => {
            e.preventDefault();
            setShowRoomData(!showRoomData);
        }

        const renderEditableCell = (cellName) => (
            <td name={cellName} onClick={() => handleEdit(cellName)} style={{ cursor: 'pointer' }}>
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
        </td>);

    return (
        <>
        {showRoomData ? <RoomData heatingData={heatingData} showRoomData={showRoomData} setShowRoomData={setShowRoomData}/> : ''}
        {response && response.error !== null && response.error !== undefined ? <MessageBox message={response.error} /> : ''}
        <tr className={markedRow}>

            {
                heatingLoading && heatingLoading === true ? (
                    <>
                    {
                        Array.from({length: totalColumns}).map((_, index) => (
                            <td className="loading-text" key={index}>####</td>
                        ))
                    }
                    </>
                ) : (
                    <>
                            <td style={{ cursor: 'pointer' }} onClick={handleOnMarkedRow}>#</td>
            <td>{heatingData ? heatingData.room_data.Floor : ''}</td>
            <td onClick={(e) => handleOpenRoomData(e, setShowRoomData)} style={{ cursor: 'pointer' }}>
                <strong>{heatingData ? heatingData.room_data.RoomNumber : ''}</strong>
                <br/>
                <span className="table-text-grey">{heatingData ? heatingData.room_data.RoomName : ''}</span>
            </td>
            {renderEditableCell("RoomHeight")}
            {renderEditableCell("OuterWallArea")}
            {renderEditableCell("InnerWallArea")}
            {renderEditableCell("WindowDoorArea")}
            {renderEditableCell("RoofArea")}
            {renderEditableCell("FloorGroundArea")}
            {renderEditableCell("FloorAirArea")}
            <td><strong>{heatingData ? (heatingData.heating_data.HeatLossSum).toFixed(0) : ''}</strong></td>
            <td>{heatingData ? heatingData.heating_data.ChosenHeating : ''}</td>
            <td>{heatingData && heatingData ? (heatingData.heating_data.ChosenHeating / heatingData.room_data.Area).toFixed(1): ''}</td>
            {renderEditableCell("HeatSource")}
            <td>
                {heatingData && heatingData.heating_data.ChosenHeating < heatingData.heating_data.HeatLossSum ? (<><strong>NB!</strong> For lite valgt varme</>) : (<></>)}
            </td>
                    </>
                )
            }

        </tr>
        </>
    );
}

export default HeatingTableRowComponent;