import { useEffect, useState, useContext } from "react";
import { useParams } from 'react-router-dom';

// Hooks
import useFetch from '../../hooks/useFetch';
import useUpdateData from '../../hooks/useUpdateData';
import useUpdateSystem from '../../hooks/useUpdateSystem';

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


function RoomTableRowComponent({ roomId, buildingReFetch, systems, allRoomData, totalColumns }) {
    const { projectId } = useParams();

    // Initial fetches and refetch
    const { data: ventData, loading: ventLoading, error: ventError, refetch: ventRefetch } = useFetch(`/project_api/${projectId}/ventilation/get_room/${roomId}/`);

    // Update data
    const { response, setData, handleSubmit: updateRoomData, loading: updateRoomLoading } = useUpdateData(`/project_api/${projectId}/ventilation/update_room/${roomId}/0/`);
    const { systemData, response: systemResponse, setResponse, setSystemData, handleSubmit: updateSystemData } = useUpdateSystem(`/project_api/${projectId}/ventilation/update_room/${roomId}/0/`);

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
        if (ventData?.data?.systemData) {
            setCurrentSystemId(ventData.data.systemData.uid);
            setCurrentSystemName(ventData.data.systemData.SystemName);
        } else {
            setCurrentSystemName("Ikke satt")
        }
    }, [ventData]);

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

    useEffect(() => {
        if (response?.success === true) {
            setData('');
            ventRefetch();
            buildingReFetch();
            setResponse("");
        }
    }, [response]);

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

    const renderEditableCell = (cellName, cellClass, width) => (
        <TableTDelement overFlow={true} cellClass={cellClass} pointer={true} width={width} name={cellName} clickFunction={() => handleEdit(cellName)}>
            {
                editingCell === cellName && ventData ? (
                    <EditableInputField value={ventData[cellName]} changeFunction={(e) => handleChange(e, cellName)} blur={handleBlur} keyDown={handleKeyDown} />
                ) : (
                    <EditableTableCell>
                        {ventData?.data?.roomData?.[cellName]}
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
        const supply = ventData?.data?.roomData?.AirSupply;
        const extract = ventData?.data?.roomData?.AirExtract;
        const min = ventData?.data?.roomData?.AirMinimum;
        const area = allRoomData && allRoomData?.roomData?.Area;
        const emission = ventData?.data?.roomData?.AirEmissionSum;
        const controls = ventData?.data?.roomData?.RoomControl;
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
            {showRoomData ? <RoomData roomData={allRoomData} ventData={ventData?.data?.roomData} showRoomData={showRoomData} setShowRoomData={setShowRoomData} /> : ''}
            {response?.success === false && <MessageBox closeable={true} message={response.message} />}
            {systemResponse?.success === false && <MessageBox closeable={true} message={systemResponse.message} />}
            {ventError && <MessageBox closeable={true} message={ventError} />}
            <MarkedRow markedRow={markedRow}>
                {
                    ventLoading || updateRoomLoading ? (
                        <LoadingRow cols={totalColumns} />
                    ) : (
                        <>
                            {
                                ventData?.success ? (
                                    <>
                                        <TableTDelement width="2%" clickFunction={handleOnMarkedRow}>
                                            <MarkRowIcon />
                                        </TableTDelement>
                                        <TableTDelement pointer={true} width="10%" clickFunction={(e) => handleOpenRoomData(e, setShowRoomData)}>
                                            <div className="flex flex-col">
                                                <div className="text-accent-color dark:text-dark-accent-color hover:text-primary-color hover:dark:text-dark-primary-color transition duration-200 font-semibold">
                                                    {allRoomData?.roomData.RoomNumber}
                                                </div>
                                                <div className="text-grey-text dark:text-dark-grey-text uppercase">
                                                    {allRoomData?.roomData.RoomName}
                                                </div>
                                            </div>
                                        </TableTDelement>
                                        <TableTDelement width="6%">
                                            {ventData && (ventData.data.roomData.AirPersonSum).toFixed(0)}
                                        </TableTDelement>
                                        <TableTDelement width="6%">
                                            {ventData && (ventData.data.roomData.AirEmissionSum).toFixed(0)}
                                        </TableTDelement>
                                        <TableTDelement width="6%">
                                            {ventData && ventData.data.roomData.AirProcess}
                                        </TableTDelement>
                                        <TableTDelement width="6%">
                                            {ventData && (ventData.data.roomData.AirDemand).toFixed(0)}
                                        </TableTDelement>
                                        {renderEditableCell("AirSupply", "supply", "6%")}
                                        {renderEditableCell("AirExtract", "extract", "6%")}
                                        <TableTDelement width="6%">
                                            {ventData && ventData.data.roomData.AirChosen}
                                        </TableTDelement>
                                        <TableTDelement width="6%">
                                            {calculateMinAirFlow()}
                                        </TableTDelement>
                                        <TableTDelement width="6%">
                                            <TableSelect handleSystemChange={handleSystemChange} currentSystemName={currentSystemName} systems={systems?.data && systems.data} />
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
                                                        ventData?.data?.roomData.AirSupply < ventData.data.roomData.AirDemand && (<div className="mr-2">For lite tilluft.</div>)
                                                    }
                                                    {
                                                        ventData?.data?.roomData.AirExtract < ventData.data.roomData.AirDemand && (<div className="mr-2">For lite avtrekk.</div>)
                                                    }
                                                    {
                                                        ventData?.data?.roomData.AirSupply !== ventData.data.roomData.AirExtract && 'Ubalanse i rom.'
                                                    }
                                                </div>
                                            </div>
                                        </TableTDelement>
                                    </>
                                ) : (
                                    <>
                                        {
                                            !ventLoading && !updateRoomLoading && <td colspan={totalColumns} className="text-center">{ventData?.message ?? ''} </td>
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

export default RoomTableRowComponent;