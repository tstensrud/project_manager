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
    const { response, setData, handleSubmit: updateRoomData } = useUpdateData(`/project_api/${projectId}/ventilation/update_room/${roomId}/0/`);
    const { systemData, response: systemResponse, setSystemData, handleSubmit: updateSystemData } = useUpdateSystem(`/project_api/${projectId}/ventilation/update_room/${roomId}/0/`);

    // Edit of values
    const [editingCell, setEditingCell] = useState(null);
    const [editedData, setEditedData] = useState(null);
    const [currentSystemId, setCurrentSystemId] = useState('');
    const [currentSystemName, setCurrentSystemName] = useState('');

    // Marking a row
    const [markedRow, setMarkedRow] = useState('');

    // Roomdata
    const [showRoomData, setShowRoomData] = useState(false);

    // useEffects
    useEffect(() => {
        if (ventData) {
            setEditedData('');
        }
        if (ventData && ventData.vent_data) {
            setCurrentSystemId(ventData.vent_data.SystemId);
            setCurrentSystemName(ventData.vent_data.SystemName);
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
            await updateRoomData(e);
            handleBlur();
        } if (e.key == "Escape") {
            handleBlur();
            return;
        }
    };

    const handleOnMarkedRow = () => {
        if (markedRow === '') {
            setMarkedRow('bg-marked-row dark:bg-dark-marked-row text-primary-color dark:text-dark-primary-color');
        } else {
            setMarkedRow('');
        }
    }

    const renderEditableCell = (cellName, cellClass, width) => (
        <TableTDelement cellClass={cellClass} pointer={true} width={width} name={cellName} clickFunction={() => handleEdit(cellName)}>
            {
                editingCell === cellName && ventData ? (
                    <EditableInputField value={ventData[cellName]} changeFunction={(e) => handleChange(e, cellName)} blur={handleBlur} keyDown={handleKeyDown} />
                ) : (
                    ventData ? ventData.vent_data[cellName] : ''
                )
            }
        </TableTDelement>
    );

    const handleSystemChange = (e) => {
        const newSystemData = { [e.target.name]: e.target.value }
        setSystemData(newSystemData);
    };

    const handleOpenRoomData = (e) => {
        e.preventDefault();
        setShowRoomData(!showRoomData);
    }

    const calculateMinAirFlow = () => {
        let minimumAir = 0;
        const supply = ventData && ventData.vent_data.AirSupply;
        const extract = ventData && ventData.vent_data.AirExtract;
        const min = ventData && ventData.vent_data.AirMinimum;
        const area = allRoomData && allRoomData.Area;
        const emission = ventData && ventData.vent_data.AirEmissionSum;
        const controls = ventData && ventData.vent_data.RoomControl;
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
            {showRoomData ? <RoomData roomData={allRoomData} ventData={ventData} showRoomData={showRoomData} setShowRoomData={setShowRoomData} /> : ''}
            {response?.success === false && <MessageBox message={response.message} />}
            {systemResponse?.success === false && <MessageBox message={systemResponse.message} />}
            {ventError && <MessageBox message={ventError} />}
            <tr className={`${markedRow} hover:bg-table-hover hover:dark:bg-dark-table-hover`}>
                {
                    ventLoading  ? (
                        <LoadingRow cols={totalColumns} />
                    ) : (
                        <>

                            <TableTDelement width="2%" clickFunction={handleOnMarkedRow}>
                                <MarkRowIcon />
                            </TableTDelement>

                            <TableTDelement pointer={true} width="10%" clickFunction={(e) => handleOpenRoomData(e, setShowRoomData)}>
                                <strong>
                                    <span className="text-accent-color dark:text-dark-accent-color">
                                        {allRoomData ? allRoomData.RoomNumber : ''}
                                    </span>
                                </strong>
                                <br />
                                <span className="text-grey-text dark:text-dark-grey-text uppercase">
                                    {allRoomData ? allRoomData.RoomName : ''}
                                </span>
                            </TableTDelement>
                            <TableTDelement width="6%">
                                {ventData ? (ventData.vent_data.AirPersonSum).toFixed(0) : ''}
                            </TableTDelement>
                            <TableTDelement width="6%">
                                {ventData ? (ventData.vent_data.AirEmissionSum).toFixed(0) : ''}
                            </TableTDelement>
                            <TableTDelement width="6%">
                                {ventData ? ventData.vent_data.AirProcess : ''}
                            </TableTDelement>
                            <TableTDelement width="6%">
                                {ventData ? (ventData.vent_data.AirDemand).toFixed(0) : ''}
                            </TableTDelement>
                            {renderEditableCell("AirSupply", "supply", "6%")}
                            {renderEditableCell("AirExtract", "extract", "6%")}
                            <TableTDelement width="6%">
                                {ventData ? ventData.vent_data.AirChosen : ''}
                            </TableTDelement>
                            <TableTDelement width="6%">
                                {calculateMinAirFlow()}
                            </TableTDelement>
                            <TableTDelement width="6%">
                                <TableSelect value={currentSystemName} name="systemUid" changeFunction={handleSystemChange}>
                                    {currentSystemName && currentSystemName !== null ? (<option key="0">{currentSystemName}</option>) : ''}
                                    {systems && Object.keys(systems.systems_data).map((key, index) => (
                                        <option key={index} value={systems.systems_data[key].uid}>{systems.systems_data[key].SystemName}</option>
                                    ))}
                                </TableSelect>
                            </TableTDelement>
                            <TableTDelement width="34%">
                                {ventData && ventData.vent_data.AirSupply && ventData.vent_data.AirExtract < ventData.vent_data.AirDemand ? (<>For lite luft. </>) : (<></>)}
                                {ventData && ventData.vent_data.AirSupply !== ventData.vent_data.AirExtract ? (<>Ubalanse i rom. </>) : (<></>)}
                            </TableTDelement>

                        </>
                    )
                }
            </tr>
        </>
    );
}

export default RoomTableRowComponent;