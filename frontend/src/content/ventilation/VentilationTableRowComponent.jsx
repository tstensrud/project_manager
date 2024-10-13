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


function RoomTableRowComponent({ buildingReFetch, roomSystemData, systems, roomData, ventData, totalColumns }) {
    const { projectId } = useParams();

    // Initial fetches and refetch
    const { data: updatedVentData, loading: ventLoading, error: ventError, fetchData: fetchUpdatedVentData } = useFetchRequest(`/project_api/${projectId}/ventilation/get_room/${roomData.uid}/`);

    // Update data
    const { response: updateVentDataResponse, setData: setVentData, handleSubmit: updateRoomData, loading: updateRoomLoading } = useUpdateData(`/project_api/${projectId}/ventilation/update_room/${roomData.uid}/0/`);
    const { systemData: updatedSystemData, response: systemResponse, setResponse, setSystemData, handleSubmit: updateSystemData } = useUpdateSystem(`/project_api/${projectId}/ventilation/update_room/${roomData.uid}/0/`);

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
        if (roomSystemData) {
            setCurrentSystemId(roomSystemData.uid);
            setCurrentSystemName(roomSystemData.SystemName);
        } else {
            setCurrentSystemName("Ikke satt")
        }
    }, [ventData]);

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
            setCurrentSystemName(updatedVentData.data.systemData.SystemName);
            setCurrentSystemId(updatedVentData.data.systemData.uid)
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
                editingCell === cellName && ventData ? (
                    <EditableInputField changeFunction={(e) => handleChange(e, cellName)} blur={handleBlur} keyDown={handleKeyDown} />
                ) : (
                    <EditableTableCell>
                        {!updatedVentData ? ventData[cellName] : updatedVentData.data.ventData[cellName]}
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

    const calculateMinAirFlow = () => {
        let minimumAir = 0;
        const supply = !updatedVentData ? ventData?.AirSupply : updatedVentData.data.ventData.AirSupply;
        const extract = !updatedVentData ? ventData?.AirExtract : updatedVentData.data.ventData.AirExtract;
        const min = ventData?.AirMinimum;
        const area = roomData && roomData?.Area;
        const emission = ventData?.AirEmissionSum;
        const controls = ventData?.RoomControl;
        const cav = ventData && controls.toUpperCase().includes("CAV");
        const vav = ventData && controls.toUpperCase().includes("VAV");

        if (cav) {
            if (supply !== 0) {
                minimumAir = supply;
            } else {
                minimumAir = extract;
            }
        }

        if (vav) {
            if (emission > (min * area)) {
                minimumAir = emission;
            } else {
                minimumAir = min * area;
            }
        }

        return minimumAir.toFixed(0);
    }
    
    return (
        <>
            {showRoomData ? <RoomData roomData={roomData} ventData={ventData} showRoomData={showRoomData} setShowRoomData={setShowRoomData} /> : ''}
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
                                            {roomData?.roomData.AirChosen}
                                        </TableTDelement>
                                        <TableTDelement width="6%">
                                            {calculateMinAirFlow()}
                                        </TableTDelement>
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
                                                                {
                                                                   updatedVentData.data.ventData.AirSupply < updatedVentData.data.ventData.AirDemand && (<div className="mr-2">For lite tilluft.</div>)
                                                                }
                                                                {
                                                                   updatedVentData.data.ventData.AirExtract < updatedVentData.data.ventData.AirDemand && (<div className="mr-2">For lite avtrekk.</div>)
                                                                }
                                                                {
                                                                   updatedVentData.data.ventData.AirSupply !== updatedVentData.data.ventData.AirExtract && 'Ubalanse i rom.'
                                                                }
                                                            </>
                                                        ) : (
                                                            <>
                                                                {
                                                                    ventData?.AirSupply < ventData.AirDemand && (<div className="mr-2">For lite tilluft.</div>)
                                                                }
                                                                {
                                                                    ventData?.AirExtract < ventData.AirDemand && (<div className="mr-2">For lite avtrekk.</div>)
                                                                }
                                                                {
                                                                    ventData?.AirSupply !== ventData.AirExtract && 'Ubalanse i rom.'
                                                                }
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