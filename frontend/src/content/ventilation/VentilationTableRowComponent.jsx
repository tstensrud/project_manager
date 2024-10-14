import { useEffect, useState, useContext } from "react";
import { useParams } from 'react-router-dom';

// Hooks
import useUpdateData from '../../hooks/useUpdateData';
import useUpdateSystem from '../../hooks/useUpdateSystem';
import useFetchRequest from '../../hooks/useFetchRequest';

// Components
import RoomData from './RoomData';
import MessageBox from '../../layout/MessageBox';
import LoadingRow from '../../layout/tableelements/LoadingRow.jsx';
import MarkedRow from "../../layout/tableelements/MarkedRow.jsx";
import EditableTableCell from "../../layout/tableelements/EditableTableCell.jsx";

// SVG
import MarkRowIcon from '../../assets/svg/MarkRowIcon.jsx';
import EditableInputField from "../../layout/tableelements/EditableInputField.jsx";
import TableTDelement from "../../layout/tableelements/TableTDelement.jsx";
import TableSelect from "../../layout/tableelements/TableSelect.jsx";


function RoomTableRowComponent({ buildingReFetch, systems, roomData, totalColumns }) {
    const { projectId } = useParams();

    // Initial fetches and refetch
    const { data: updatedVentData, loading: ventLoading, error: ventError, fetchData: fetchUpdatedVentData } = useFetchRequest(`/project_api/${projectId}/rooms/get_room/${roomData.roomData.uid}/`);

    // Update data
    const { response: updateVentDataResponse, setData: setVentData, handleSubmit: updateRoomData, loading: updateRoomLoading } = useUpdateData(`/project_api/${projectId}/ventilation/update_room/${roomData.roomData.uid}/0/`);
    const { systemData: updatedSystemData, response: systemResponse, setResponse, setSystemData, handleSubmit: updateSystemData } = useUpdateSystem(`/project_api/${projectId}/ventilation/update_room/${roomData.roomData.uid}/0/`);

    // Edit of values
    const [editingCell, setEditingCell] = useState(null);
    const [currentSystemId, setCurrentSystemId] = useState('');
    const [currentSystemName, setCurrentSystemName] = useState('');

    // Row marking
    const [markedRow, setMarkedRow] = useState(false);

    // Roomdata
    const [showRoomData, setShowRoomData] = useState(false);
    
    // useEffects
    useEffect(() => {
        if (roomData?.ventSystemData) {
            setCurrentSystemId(roomData?.ventSystemData?.uid);
            setCurrentSystemName(roomData?.ventSystemData?.SystemName);
        } else {
            setCurrentSystemName("Ikke satt")
        }
    }, [roomData]);

    useEffect(() => {
        if (updatedSystemData) {
            
            if (currentSystemId !== updatedSystemData) {
                updateSystemData();
                setSystemData(null);
            }
        }
    }, [updatedSystemData]);

    useEffect(() => {
        if (systemResponse?.success) {
            fetchUpdatedVentData();
        }
    }, [systemResponse]);

    useEffect(() => {
        if (updatedVentData?.success) {
            setCurrentSystemName(updatedVentData?.data?.ventSystemData?.SystemName);
            setCurrentSystemId(updatedVentData?.data?.ventSystemData?.uid)
        }
    },[updatedVentData])

    useEffect(() => {
        if (updateVentDataResponse?.success === true) {
            setVentData('');
            fetchUpdatedVentData();
            buildingReFetch();
            setResponse("");
        }
    }, [updateVentDataResponse]);

    // Handlers
    const handleEdit = (cellName) => {
        setEditingCell(cellName);
    };

    const handleChange = (e, cellName) => {
        setVentData((prevData) => ({
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

    const renderEditableCell = (cellName, cellClass, width) => (
        <TableTDelement overFlow={true} cellClass={cellClass} pointer={true} width={width} name={cellName} clickFunction={() => handleEdit(cellName)}>
            {
                editingCell === cellName && roomData ? (
                    <EditableInputField changeFunction={(e) => handleChange(e, cellName)} blur={handleBlur} keyDown={handleKeyDown} />
                ) : (
                    <EditableTableCell>
                        {!updatedVentData ? roomData.roomData[cellName] : updatedVentData.data.roomData[cellName]}
                    </EditableTableCell>
                )
            }
        </TableTDelement>
    );

    const handleSystemChange = (newSystemUid) => {
        const newSystemData = { systemUid: newSystemUid }
        setSystemData(newSystemData);
    };

    const handleOpenRoomData = (e) => {
        e.preventDefault();
        setShowRoomData(!showRoomData);
    }
    
    return (
        <>
            {showRoomData ? <RoomData roomData={!updatedVentData ? roomData : updatedVentData.data} showRoomData={showRoomData} setShowRoomData={setShowRoomData} /> : ''}
            {updateVentDataResponse?.success === false && <MessageBox closeable={true} message={updateVentDataResponse.message} />}
            {systemResponse?.success === false && <MessageBox closeable={true} message={systemResponse.message} />}
            {ventError && <MessageBox closeable={true} message={ventError} />}
            <MarkedRow markedRow={markedRow}>
                {
                    ventLoading || updateRoomLoading ? (
                        <LoadingRow cols={totalColumns} />
                    ) : (
                        <>
                            {
                                roomData ? (
                                    <>
                                        <TableTDelement width="2%" clickFunction={handleOnMarkedRow}>
                                            <MarkRowIcon />
                                        </TableTDelement>
                                        <TableTDelement pointer={true} width="10%" clickFunction={(e) => handleOpenRoomData(e, setShowRoomData)}>
                                            <div className="flex flex-col">
                                                <div className="text-accent-color dark:text-dark-accent-color hover:text-primary-color hover:dark:text-dark-primary-color transition duration-200 font-semibold">
                                                    {roomData?.roomData.RoomNumber}
                                                </div>
                                                <div className="text-grey-text dark:text-dark-grey-text uppercase">
                                                    {roomData?.roomData.RoomName}
                                                </div>
                                            </div>
                                        </TableTDelement>
                                        <TableTDelement width="6%">
                                            {roomData?.roomData.AirPersonSum.toFixed(0)}
                                        </TableTDelement>
                                        <TableTDelement width="6%">
                                            {roomData?.roomData.AirEmissionSum.toFixed(0)}
                                        </TableTDelement>
                                        <TableTDelement width="6%">
                                            {roomData?.roomData.AirProcess}
                                        </TableTDelement>
                                        <TableTDelement width="6%">
                                            {roomData?.roomData.AirDemand.toFixed(0)}
                                        </TableTDelement>
                                        {renderEditableCell("AirSupply", "supply", "6%")}
                                        {renderEditableCell("AirExtract", "extract", "6%")}
                                        <TableTDelement width="6%">
                                            {!updatedVentData ? roomData?.roomData.AirChosen : updatedVentData.data.roomData.AirChosen}
                                        </TableTDelement>
                                            {renderEditableCell("AirMinimum", "6%")}
                                        <TableTDelement width="6%">
                                            <TableSelect handleSystemChange={handleSystemChange} currentSystemName={currentSystemName} systems={systems?.data} />
                                        </TableTDelement>
                                        <TableTDelement lastCell={true} width="34%">
                                            <div className="flex flex-row w-full">
                                                <div className="text-start pl-2 animate-fade w-44">
                                                    {
                                                        systemResponse?.success && systemResponse.message
                                                    }
                                                </div>
                                                <div className="flex flex-row">
                                                    {
                                                        updatedVentData?.success ? (
                                                            <>
                                                                {updatedVentData.data.roomData.AirSupply < updatedVentData.data.roomData.AirDemand && (<div className="mr-2">For lite tilluft.</div>)}
                                                                {updatedVentData.data.roomData.AirExtract < updatedVentData.data.roomData.AirDemand && (<div className="mr-2">For lite avtrekk.</div>)}
                                                                {updatedVentData.data.roomData.AirSupply !== updatedVentData.data.roomData.AirExtract && <div className="mr-2">Ubalanse i rom.</div>}
                                                                {updatedVentData.data.roomData.AirChosen > 40 && 'OBS! Høy luftmengde.'}
                                                            </>
                                                        ) : (
                                                            <>
                                                                {roomData?.roomData.AirSupply < roomData?.roomData.AirDemand && (<div className="mr-2">For lite tilluft.</div>)}
                                                                {roomData?.roomData?.AirExtract < roomData?.roomData.AirDemand && (<div className="mr-2">For lite avtrekk.</div>)}
                                                                {roomData?.roomData?.AirSupply !== roomData?.roomData.AirExtract && <div className="mr-2">Ubalanse i rom.</div>}
                                                                {roomData?.roomData.AirChosen > 40 && 'OBS! Høy luftmengde.'}
                                                            </>
                                                        )
                                                    }
                                                </div>
                                            </div>
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

export default RoomTableRowComponent;