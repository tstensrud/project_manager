import { useEffect, useState, useContext } from "react";
import { useParams } from 'react-router-dom';
import { GlobalContext } from '../../GlobalContext';

// Hooks
import useFetch from '../../hooks/useFetch';
import useUpdateData from '../../hooks/useUpdateData';

// Components
import RoomData from './RoomData';
import MessageBox from '../../layout/MessageBox';

// SVG
import MarkRowIcon from '../../assets/svg/MarkRowIcon.jsx';


function HeatingTableRowComponent({ roomId, buildingReFetch, settingsUpdateState, totalColumns }) {
    const { projectId } = useParams();
    const { setActiveProject } = useContext(GlobalContext);


    // Initial fetches and refetch
    const { data: heatingData, loading: heatingLoading, refetch: heatingRefetch } = useFetch(`/project_api/${projectId}/heating/get_room/${roomId}/`);

    // Update data
    const { data: updatedRoomData, response, setData, handleSubmit: updateRoomData } = useUpdateData(`/project_api/${projectId}/heating/update_room/${roomId}/`);

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
    }, [settingsUpdateState]);

    useEffect(() => {
        if (heatingData) {
            setEditedData('');
        }
    }, [heatingData]);

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

    const handleBlur = () => {
        setEditingCell(null);
    };

    const handleKeyDown = async (e) => {
        if (e.key === "Enter") {
            await updateRoomData(e);
            handleBlur();
            setData('');
            heatingRefetch();
            buildingReFetch();
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

    const renderEditableCell = (cellName, width) => (
        <td width={width} name={cellName} onClick={() => handleEdit(cellName)} className="cursor-pointer">
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
            {showRoomData ? <RoomData heatingData={heatingData} showRoomData={showRoomData} setShowRoomData={setShowRoomData} /> : ''}
            {response && response.error !== null && response.error !== undefined ? <MessageBox message={response.error} /> : ''}
            <tr className={markedRow}>

                {
                    heatingLoading && heatingLoading === true ? (
                        <>
                            {
                                Array.from({ length: totalColumns }).map((_, index) => (
                                    <td className="blur-sm opacity-50" key={index}>####</td>
                                ))
                            }
                        </>
                    ) : (
                        <>
                            <td width="2%" className="cursor-pointer" onClick={handleOnMarkedRow}>
                                <MarkRowIcon />
                            </td>
                            <td width="5%" onClick={(e) => handleOpenRoomData(e, setShowRoomData)} className="cursor-pointer">
                                <strong>
                                    <span className="text-accent-color">
                                        {heatingData ? heatingData.room_data.RoomNumber : ''}
                                    </span>
                                </strong>
                                <br />
                                <span className="text-grey-text">
                                    {heatingData ? heatingData.room_data.RoomName : ''}
                                </span>
                            </td>
                            {renderEditableCell("RoomHeight", "5%")}
                            {renderEditableCell("OuterWallArea", "5%")}
                            {renderEditableCell("InnerWallArea", "5%")}
                            {renderEditableCell("WindowDoorArea", "5%")}
                            {renderEditableCell("RoofArea", "5%")}
                            {renderEditableCell("FloorGroundArea", "5%")}
                            {renderEditableCell("FloorAirArea", "5%")}
                            <td width="5%">
                                <strong>
                                    {heatingData ? (heatingData.heating_data.HeatLossSum).toFixed(0) : ''}
                                </strong>
                            </td>
                            <td width="5%">
                                {heatingData ? heatingData.heating_data.ChosenHeating : ''}
                            </td>
                            <td width="5%">
                                {heatingData && heatingData ? (heatingData.heating_data.ChosenHeating / heatingData.room_data.Area).toFixed(1) : ''}
                            </td>
                            {renderEditableCell("HeatSource", "8%")}
                            <td width="10%">
                                {
                                    heatingData && heatingData.heating_data.ChosenHeating < heatingData.heating_data.HeatLossSum ? (
                                        <>
                                            <strong>NB!</strong> For lite valgt varme
                                        </>
                                    ) : (
                                        <></>
                                    )
                                }
                            </td>
                        </>
                    )
                }

            </tr>
        </>
    );
}

export default HeatingTableRowComponent;