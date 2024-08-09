import { useEffect, useState, useContext } from "react";
import { useParams } from 'react-router-dom';
import { GlobalContext } from '../../GlobalContext';

import MessageBox from '../../layout/MessageBox';
import useFetch from '../../hooks/useFetch';
import useUpdateData from '../../hooks/useUpdateData';


function SanitaryTableRowComponent({roomId, msgToParent, index, allRoomData, totalColumns}) {
        const {projectId} = useParams();
        const { activeProject, setActiveProject, token, setToken } = useContext(GlobalContext);
        //console.log(allRoomData);

        
        // Initial fetches and refetch
        const {data: sanitaryData, loading: sanitaryLoading, error: sanitaryError, refetch: sanitaryRefetch} = useFetch(`/project_api/${projectId}/sanitary/get_room/${roomId}/`);
        
        // Update data
        const {data: updatedRoomData, response, setData, handleSubmit: updateRoomData} = useUpdateData(`/project_api/${projectId}/sanitary/update_room/${roomId}/`);
        
        
        // Edit of values
        const [editingCell, setEditingCell] = useState(null);
        const [editedData, setEditedData] = useState(null);

        // Marking a row
        const [markedRow, setMarkedRow] = useState('');

        // Roomdata
        const [showRoomData, setShowRoomData] = useState(false);

        // useEffects
        useEffect(() => {
            setActiveProject(projectId);
        },[]);

        useEffect(() => {
            if(sanitaryData) {
                setEditedData('');
            }
        },[sanitaryData]);

        
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
                sanitaryRefetch();
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

        const renderEditableCell = (cellName) => (
            <td name={cellName} onClick={() => handleEdit(cellName)} style={{ cursor: 'pointer' }}>
            {editingCell === cellName && sanitaryData ? (
                <input
                    type="text"
                    className="table-input"
                    value={sanitaryData[cellName]}
                    onChange={(e) => handleChange(e, cellName)}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                    autoFocus
                />
            ) : (
                sanitaryData ? sanitaryData.sanitary_data[cellName] : ''
            )}
        </td>   
        );

        const handleOpenRoomData = (e) => {
            e.preventDefault();
            setShowRoomData(!showRoomData);
        }


    return (
        <>
        
        {response && response.error ? <MessageBox message={response.error} /> : null}
        <tr className={markedRow}>
            {
                sanitaryLoading && sanitaryLoading === true ? (
                <>
                {
                    Array.from({length: totalColumns}).map((_, index) => (
                        <td className="loading-text" key={index}>####</td>
                    ))
                }
                </>
                ) : (
                <>
            <td style={{ cursor: 'pointer', width: "30px" }} onClick={handleOnMarkedRow}>#</td>
            <td style={{width: "50px"}}>{allRoomData ? allRoomData.Floor : ''}</td>
            <td  onClick={(e) => handleOpenRoomData(e, setShowRoomData)} style={{ /*cursor: 'pointer',*/ textTransform: 'uppercase' }}>
                <strong>{allRoomData ? allRoomData.RoomNumber : ''}</strong>
                <br />
                <span className="table-text-grey">{allRoomData ? allRoomData.RoomName : ''}</span>
            </td>
            {renderEditableCell("shaft")}
            {renderEditableCell("sink_1_14_inch")}
            {renderEditableCell("sink_large")}
            {renderEditableCell("wc")}
            {renderEditableCell("urinal")}
            {renderEditableCell("dishwasher")}
            {renderEditableCell("shower")}
            {renderEditableCell("tub")}
            {renderEditableCell("washing_machine")}
            {renderEditableCell("tap_water_outlet_inside")}
            {renderEditableCell("tap_water_outlet_outside")}
            {renderEditableCell("firehose")}
            {renderEditableCell("drain_75_mm")}
            {renderEditableCell("drain_110_mm")}
                </>
                )
            }

        </tr>
        </>
    );
}

export default SanitaryTableRowComponent;