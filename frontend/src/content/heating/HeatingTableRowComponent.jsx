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
import EditableInputField from "../../layout/tableelements/EditableInputField.jsx";
import TableTDelement from "../../layout/tableelements/TableTDelement.jsx";

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
            setMarkedRow('bg-marked-row text-primary-color');
        } else {
            setMarkedRow('');
        }
    }

    const handleOpenRoomData = (e) => {
        e.preventDefault();
        setShowRoomData(!showRoomData);
    }

    const renderEditableCell = (cellName, width) => (
        <TableTDelement pointer={true} width={width} name={cellName} clickFunction={() => handleEdit(cellName)}>
            {
                editingCell === cellName && heatingData ? (
                    <EditableInputField value={heatingData[cellName]} changeFunction={(e) => handleChange(e, cellName)} blur={handleBlur} keyDown={handleKeyDown} />
                ) : (
                    heatingData ? heatingData.heating_data[cellName] : ''
                )
            }
        </TableTDelement>
    );

    return (
        <>
            {showRoomData ? <RoomData heatingData={heatingData} showRoomData={showRoomData} setShowRoomData={setShowRoomData} /> : ''}
            {response && response.error !== null && response.error !== undefined ? <MessageBox message={response.error} /> : ''}
            <tr className={`${markedRow} hover:bg-table-hover`}>
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
                            <TableTDelement width="2%" clickFunction={handleOnMarkedRow}>
                                <MarkRowIcon />
                            </TableTDelement>
                            <TableTDelement pointer={true} width="5%" clickFunction={(e) => handleOpenRoomData(e, setShowRoomData)}>
                                <div className="text-accent-color font-semibold">
                                    {heatingData ? heatingData.room_data.RoomNumber : ''}
                                </div>
                                <div className="text-grey-text uppercase font-semibold">
                                    {heatingData ? heatingData.room_data.RoomName : ''}
                                </div>
                            </TableTDelement>
                            {renderEditableCell("RoomHeight", "5%")}
                            {renderEditableCell("OuterWallArea", "5%")}
                            {renderEditableCell("InnerWallArea", "5%")}
                            {renderEditableCell("WindowDoorArea", "5%")}
                            {renderEditableCell("RoofArea", "5%")}
                            {renderEditableCell("FloorGroundArea", "5%")}
                            {renderEditableCell("FloorAirArea", "5%")}
                            <TableTDelement width="5%">
                                <strong>
                                    {heatingData ? (heatingData.heating_data.HeatLossSum).toFixed(0) : ''}
                                </strong>
                            </TableTDelement>
                            
                            <TableTDelement width="5%">
                                {heatingData ? heatingData.heating_data.ChosenHeating : ''}
                            </TableTDelement>
                            <TableTDelement width="5%">
                                {heatingData && heatingData ? (heatingData.heating_data.ChosenHeating / heatingData.room_data.Area).toFixed(1) : ''}
                            </TableTDelement>
                            {renderEditableCell("HeatSource", "8%")}

                            <TableTDelement width="10%">
                                {
                                    heatingData && heatingData.heating_data.ChosenHeating < heatingData.heating_data.HeatLossSum && (
                                        <>
                                            <strong>NB!</strong> For lite valgt varme
                                        </>
                                    )
                                }
                            </TableTDelement>
                        </>
                    )
                }

            </tr>
        </>
    );
}

export default HeatingTableRowComponent;