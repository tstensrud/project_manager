import { useEffect, useState, useContext } from "react";
import { useParams } from 'react-router-dom';
import { GlobalContext } from '../../GlobalContext';

// Hooks
import useFetch from '../../hooks/useFetch';
import useUpdateData from '../../hooks/useUpdateData';
import useUpdateSystem from '../../hooks/useUpdateSystem';

// Components
import RoomData from './RoomData';
import MessageBox from '../../layout/MessageBox';

// SVG
import MarkRowIcon from '../../assets/svg/MarkRowIcon.svg?react';


function RoomTableRowComponent({ roomId, buildingReFetch, systems, index, allRoomData, totalColumns }) {
    const { projectId } = useParams();
    const { activeProject, setActiveProject, token, setToken } = useContext(GlobalContext);
    //console.log(allRoomData);


    // Initial fetches and refetch
    const { data: ventData, loading: ventLoading, error: ventError, refetch: ventRefetch } = useFetch(`/project_api/${projectId}/ventilation/get_room/${roomId}/`);

    // Update data
    const { data: updatedRoomData, response, setData, handleSubmit: updateRoomData } = useUpdateData(`/project_api/${projectId}/ventilation/update_room/${roomId}/0/`);
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
            ventRefetch();
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

    const renderEditableCell = (cellName, cellClass, width) => (
        <td width={width} className={cellClass} name={cellName} onClick={() => handleEdit(cellName)} style={{ cursor: 'pointer' }}>
            {editingCell === cellName && ventData ? (
                <input
                    type="text"
                    className="table-input"
                    value={ventData[cellName]}
                    onChange={(e) => handleChange(e, cellName)}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                    autoFocus
                />
            ) : (
                ventData ? ventData.vent_data[cellName] : ''
            )}
        </td>
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
            {response && response.error ? <MessageBox message={response.error} /> : null}
            <tr className={markedRow}>
                {
                    ventLoading && ventLoading === true ? (
                        <>
                            {
                                Array.from({ length: totalColumns }).map((_, index) => (
                                    <td className="loading-text" key={index}>#### <br /></td>
                                ))
                            }
                        </>
                    ) : (
                        <>

                            <td width="2%" style={{ cursor: 'pointer' }} onClick={handleOnMarkedRow}>
                                <MarkRowIcon />
                            </td>
                            {/* <td width="2%">{allRoomData ? allRoomData.Floor : ''}</td> */}
                            <td width="10%" onClick={(e) => handleOpenRoomData(e, setShowRoomData)} style={{ cursor: 'pointer', textTransform: 'uppercase' }}>
                                <strong>
                                    <span className="table-link">
                                        {allRoomData ? allRoomData.RoomNumber : ''}
                                    </span>
                                </strong>
                                <br />
                                <span className="table-text-grey">
                                    {allRoomData ? allRoomData.RoomName : ''}
                                </span>
                            </td>
                            <td width="6%">
                                {ventData ? (ventData.vent_data.AirPersonSum).toFixed(0) : ''}
                            </td>
                            <td width="6%">
                                {ventData ? (ventData.vent_data.AirEmissionSum).toFixed(0) : ''}
                            </td>
                            <td width="6%">
                                {ventData ? ventData.vent_data.AirProcess : ''}
                            </td>
                            <td width="6%">
                                {ventData ? (ventData.vent_data.AirDemand).toFixed(0) : ''}
                            </td>
                            {renderEditableCell("AirSupply", "supplyCell", "6%")}
                            {renderEditableCell("AirExtract", "extractCell", "6%")}
                            <td width="6%">
                                {ventData ? ventData.vent_data.AirChosen : ''}
                            </td>
                            <td width="6%">
                                {calculateMinAirFlow()}
                            </td>
                            <td width="6%">
                                <select value={currentSystemName} name="systemUid" className="table-select" onChange={handleSystemChange}>
                                    {currentSystemName && currentSystemName !== null ? (<option key="0">{currentSystemName}</option>) : ''}
                                    {systems && Object.keys(systems.systems_data).map((key, index) => (
                                        <option key={index} value={systems.systems_data[key].uid}>{systems.systems_data[key].SystemName}</option>
                                    ))}
                                </select>
                            </td>
                            <td width="34%" className="comments-cell no-print">
                                {ventData && ventData.vent_data.AirSupply && ventData.vent_data.AirExtract < ventData.vent_data.AirDemand ? (<>For lite luft. </>) : (<></>)}
                                {ventData && ventData.vent_data.AirSupply !== ventData.vent_data.AirExtract ? (<>Ubalanse i rom. </>) : (<></>)}
                            </td>

                        </>
                    )
                }
            </tr>
        </>
    );
}

export default RoomTableRowComponent;