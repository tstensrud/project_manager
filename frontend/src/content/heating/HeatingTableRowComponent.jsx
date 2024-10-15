import { useEffect, useState, useContext } from "react";

// Hooks and utils
import useFetchRequest from '../../hooks/useFetchRequest';
import useUpdateData from '../../hooks/useUpdateData';
import { GlobalContext } from '../../context/GlobalContext';

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

function HeatingTableRowComponent({ buildingReFetch, roomData, totalColumns, roomTypeData, buildingData, settingsUpdatedState }) {
    const { activeProject } = useContext(GlobalContext);
    const [serverSuccesFalseMsg, setServerSuccesFalseMsg] = useState(null);
    const [currentSettingsCounter, setCurrentSettingsCounter] = useState(0);

    // Initial fetches and refetch
    const { data: updatedHeatingData, loading: heatingLoading, fetchData: heatingRefetch } = useFetchRequest(`/project_api/${activeProject}/rooms/get_room/${roomData.roomData.uid}/`);

    // Update data
    const { response: updateRoomDataResponse, setData, handleSubmit: updateRoomData, loading: updateRoomDataLoading } = useUpdateData(`/project_api/${activeProject}/heating/update_room/${roomData.roomData.uid}/`);

    // Edit of values
    const [editingCell, setEditingCell] = useState(null);

    // Marking a row
    const [markedRow, setMarkedRow] = useState(false);

    // Room data
    const [showRoomData, setShowRoomData] = useState(false);

    // useEffects
    useEffect(() => { // Refetch upon received message that cooling settings has changed
        if (settingsUpdatedState > currentSettingsCounter) {
            heatingRefetch();
            setCurrentSettingsCounter(prevCounter => prevCounter + 1);
        }
    }, [settingsUpdatedState]);

    useEffect(() => {
        if (updateRoomDataResponse?.success) {
            heatingRefetch();
            buildingReFetch();
        }
        if (updateRoomDataResponse?.success === false) {
            setServerSuccesFalseMsg(updateRoomDataResponse.message);
        }
        setData('');
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
                editingCell === cellName && roomData ? (
                    <EditableInputField changeFunction={(e) => handleChange(e, cellName)} blur={handleBlur} keyDown={handleKeyDown} />
                ) : (
                    <EditableTableCell>
                        {!updatedHeatingData ? roomData.roomData[cellName] : updatedHeatingData.data.roomData[cellName]}
                    </EditableTableCell>
                )
            }
        </TableTDelement>
    );
    
    return (
        <>
            {showRoomData && <RoomData roomTypeData={roomTypeData} buildingData={buildingData} roomData={roomData} showRoomData={showRoomData} setShowRoomData={setShowRoomData} />}
            {serverSuccesFalseMsg && <MessageBox setServerSuccesFalseMsg={setServerSuccesFalseMsg} closeable={true} message={serverSuccesFalseMsg} />}
            <MarkedRow markedRow={markedRow}>
                {
                    heatingLoading || updateRoomDataLoading ? (
                        <LoadingRow cols={totalColumns} />
                    ) : (
                        <>
                            {
                                roomData ? (
                                    <>
                                        <TableTDelement width="2%" clickFunction={handleOnMarkedRow}>
                                            <MarkRowIcon />
                                        </TableTDelement>
                                        <TableTDelement pointer={true} width="5%" clickFunction={(e) => handleOpenRoomData(e, setShowRoomData)}>
                                            <div className="flex flex-col">
                                                <div className="text-accent-color dark:text-dark-accent-color hover:text-primary-color hover:dark:text-dark-primary-color transition duration-200 font-semibold">
                                                    {roomData?.roomData.RoomNumber}
                                                </div>
                                                <div className="text-grey-text dark:text-dark-grey-text uppercase">
                                                    {roomData?.roomData.RoomName}
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
                                                {!updatedHeatingData ? roomData?.roomData.HeatLossSum.toFixed(0) : updatedHeatingData.data.roomData.HeatLossSum}
                                            </strong>
                                        </TableTDelement>

                                        <TableTDelement width="5%">
                                        {!updatedHeatingData ? roomData?.roomData.ChosenHeating.toFixed(0) : updatedHeatingData.data.roomData.ChosenHeating}
                                        </TableTDelement>
                                        <TableTDelement width="5%">
                                            {!updatedHeatingData ? (roomData?.roomData.ChosenHeating / roomData.roomData.Area).toFixed(1) : (updatedHeatingData.data.roomData.ChosenHeating / roomData?.roomData.Area).toFixed(1) }
                                        </TableTDelement>
                                        {renderEditableCell("HeatSource", "8%")}

                                        <TableTDelement width="10%">

                                        </TableTDelement>
                                    </>
                                ) : (
                                    <td colspan={totalColumns} className="text-center">En feil har oppstått. Prøve igjen og kontakt admin ved vedvarende feil.</td>
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