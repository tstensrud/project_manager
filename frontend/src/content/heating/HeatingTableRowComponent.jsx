import { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';

// Hooks
import useFetch from '../../hooks/useFetch';
import useUpdateData from '../../hooks/useUpdateData';

// Components
import RoomData from './RoomData';
import MessageBox from '../../layout/MessageBox';
import MarkedRow from "../../layout/tableelements/MarkedRow.jsx";
import EditableTableCell from "../../layout/tableelements/EditableTableCell.jsx";

// SVG
import MarkRowIcon from '../../assets/svg/MarkRowIcon.jsx';
import EditableInputField from "../../layout/tableelements/EditableInputField.jsx";
import TableTDelement from "../../layout/tableelements/TableTDelement.jsx";
import LoadingRow from "../../layout/tableelements/LoadingRow.jsx";

function HeatingTableRowComponent({ roomId, buildingReFetch, allRoomData, totalColumns, buildingData, settingsUpdatedState }) {
    const { projectId } = useParams();

    // Initial fetches and refetch
    const { data: heatingData, loading: heatingLoading, refetch: heatingRefetch } = useFetch(`/project_api/${projectId}/heating/get_room/${roomId}/`);

    // Update data
    const { data: updatedRoomData, response: updateRoomDataResponse, setData, handleSubmit: updateRoomData, loading: updateRoomDataLoading } = useUpdateData(`/project_api/${projectId}/heating/update_room/${roomId}/`);

    // Edit of values
    const [editingCell, setEditingCell] = useState(null);

    // Marking a row
    const [markedRow, setMarkedRow] = useState(false);

    // Room data
    const [showRoomData, setShowRoomData] = useState(false);

    // useEffects
    useEffect(() => { // Refetch upon received message theat heating settings has changed
        heatingRefetch();
    }, [settingsUpdatedState]);

    useEffect(() => {
        if (updateRoomDataResponse?.success === true) {
            setData('');
            heatingRefetch();
            buildingReFetch();
        }
    }, [updateRoomDataResponse])

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
            e.preventDefault();
            await updateRoomData();
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
                    <EditableTableCell>
                        {heatingData ? heatingData.heating_data[cellName] : ''}
                    </EditableTableCell>
                )
            }
        </TableTDelement>
    );
    
    return (
        <>
            {showRoomData ? <RoomData buildingData={buildingData} roomData={allRoomData} heatingData={heatingData} showRoomData={showRoomData} setShowRoomData={setShowRoomData} /> : ''}
            {updateRoomDataResponse?.success === false && <MessageBox closeable={true} message={updateRoomDataResponse.message} />}
            <MarkedRow markedRow={markedRow}>
                {
                    heatingLoading || updateRoomDataLoading ? (
                        <LoadingRow cols={totalColumns} />
                    ) : (
                        <>
                            {
                                heatingData?.success ? (
                                    <>
                                        <TableTDelement width="2%" clickFunction={handleOnMarkedRow}>
                                            <MarkRowIcon />
                                        </TableTDelement>
                                        <TableTDelement pointer={true} width="5%" clickFunction={(e) => handleOpenRoomData(e, setShowRoomData)}>
                                            <div className="flex flex-col">
                                                <div className="text-accent-color dark:text-dark-accent-color hover:text-primary-color hover:dark:text-dark-primary-color transition duration-200 font-semibold">
                                                    {allRoomData?.roomData.RoomNumber}
                                                </div>
                                                <div className="text-grey-text dark:text-dark-grey-text uppercase">
                                                    {allRoomData?.roomData.RoomName}
                                                </div>
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
                                            {heatingData?.heating_data?.ChosenHeating}
                                        </TableTDelement>
                                        <TableTDelement width="5%">
                                            {heatingData && heatingData && (heatingData.heating_data.ChosenHeating / allRoomData.roomData.Area).toFixed(1)}
                                        </TableTDelement>
                                        {renderEditableCell("HeatSource", "8%")}

                                        <TableTDelement width="10%">
                                            {
                                                heatingData?.heating_data?.ChosenHeating < heatingData?.heating_data?.HeatLossSum && (
                                                    <>
                                                        <strong>NB!</strong> For lite valgt varme
                                                    </>
                                                )
                                            }
                                        </TableTDelement>
                                    </>
                                ) : (
                                    <>
                                    {
                                        !heatingLoading && !updateRoomDataLoading && <td colspan={totalColumns} className="text-center">{heatingData.message}</td>
                                    }
                                    
                                    </>
                                )
                            }
                        </>
                    )
                }
            </MarkedRow>
        </>
    );
}

export default HeatingTableRowComponent;