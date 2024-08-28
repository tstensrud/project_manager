import { useEffect, useState, useContext } from "react";
import { Link, useParams } from 'react-router-dom';
import { GlobalContext } from '../../GlobalContext';

import MessageBox from '../../layout/MessageBox';
import useFetch from '../../hooks/useFetch';
import useUpdateData from '../../hooks/useUpdateData';


function CoolingTableRowComponent({ roomId, msgToParent, settingsUpdateState, totalColumns, index }) {
    const { projectId } = useParams();
    const { activeProject, setActiveProject, token, setToken } = useContext(GlobalContext);
    const [extraAirNeeded, setExtraAirNeeded] = useState(0)


    // Initial fetches and refetch
    const { data: coolingData, loading: coolingLoading, error: coolingError, refetch: coolingRefetch } = useFetch(`/project_api/${projectId}/cooling/get_room/${roomId}/`);

    // Update data
    const { data: updatedRoomData, response: updateRoomDataResponse, setData, handleSubmit: updateRoomData } = useUpdateData(`/project_api/${projectId}/cooling/update_room/${roomId}/`);
    const { data: updateVentilationData, response: updateVentDataResponse, setData: setUpdateVentData, handleSubmit: updateVentilationDataSubmit } = useUpdateData(`/project_api/${projectId}/ventilation/update_room/${roomId}/1/`);

    // Edit of values
    const [editingCell, setEditingCell] = useState(null);
    const [editedData, setEditedData] = useState(null);

    // Marking a row
    const [markedRow, setMarkedRow] = useState('');

    // useEffects
    useEffect(() => { // Refetch upon received message that cooling settings has changed
        coolingRefetch();
    }, [settingsUpdateState]);

    useEffect(() => {
        setActiveProject(projectId);
    }, []);

    useEffect(() => {
        if (coolingData) {
            setEditedData('');
            calculateExtraAirNeeded();
        }
    }, [coolingData]);

    useEffect(() => {
        if (updateVentDataResponse && updateVentDataResponse.success === true) {
            console.log("Vent data response: ", updateVentDataResponse);
            setUpdateVentData({});
            coolingRefetch();
        }
        if (updateRoomDataResponse && updateRoomDataResponse.success === true) {
            console.log("Room data response: ", updateRoomDataResponse);
            setData({});
            coolingRefetch();
        }
    },[updateVentDataResponse, updateRoomDataResponse])
    
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
            setMarkedRow('marked-row');
        } else {
            setMarkedRow('');
        }
    }

    const calculateExtraAirNeeded = () => {
        const { SumInternalHeatLoad, CoolingSum, VentairTempSummer, RoomTempSummer } = coolingData.cooling_data;
        const calculatedValue = (SumInternalHeatLoad - CoolingSum) / (0.35 * (VentairTempSummer - RoomTempSummer));
        const airFlow = coolingData && coolingData.cooling_data.Airflow;
        if (calculatedValue < 0) {
            setExtraAirNeeded(calculatedValue.toFixed(0));
            setUpdateVentData({air_supply: ((calculatedValue.toFixed(0) * - 1) + airFlow), air_extract: ((calculatedValue.toFixed(0) * - 1) + airFlow)})
        } else {
            setExtraAirNeeded(0);
        }
    }

    const renderEditableCell = (cellName) => (
        <td name={cellName} onClick={() => handleEdit(cellName)} style={{ cursor: 'pointer' }}>
            {editingCell === cellName && coolingData ? (
                <input
                    type="text"
                    className="table-input"
                    value={coolingData[cellName]}
                    onChange={(e) => handleChange(e, cellName)}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                    autoFocus
                />
            ) : (
                coolingData ? coolingData.cooling_data[cellName] : ''
            )}
        </td>
    );

    const handleUpdateVentilation = async (e) => {
        e.preventDefault();
        console.log(updateVentilationData)
        await updateVentilationDataSubmit(e);
    }

    if (updateRoomDataResponse && updateRoomDataResponse.error !== null && updateRoomDataResponse.error !== undefined) return (<><MessageBox message={updateRoomDataResponse.error} /></>);
    return (
        <>
            <tr className={markedRow}>
                {
                    coolingLoading && coolingLoading === true ? (
                        <>
                            {
                                Array.from({ length: totalColumns }).map((_, index) => (
                                    <td className="loading-text" key={index}>####</td>
                                ))
                            }
                        </>
                    ) : (
                        <>
                            <td style={{ cursor: 'pointer' }} onClick={handleOnMarkedRow}>#</td>
                            <td>{coolingData ? coolingData.room_data.Floor : ''}</td>
                            <td>
                                {coolingData ? coolingData.room_data.RoomNumber : ''}
                                <br />
                                <span className="table-text-grey">{coolingData ? coolingData.room_data.RoomName : ''}</span>

                            </td>
                            {renderEditableCell("RoomTempSummer")}
                            {renderEditableCell("VentairTempSummer")}
                            {renderEditableCell("InternalHeatloadPeople")}
                            {renderEditableCell("InternalHeatloadLights")}
                            {renderEditableCell("InternalHeatloadEquipment")}
                            {renderEditableCell("SunAdition")}
                            {renderEditableCell("SunReduction")}
                            <td>{coolingData ? coolingData.cooling_data.SumInternalHeatLoad : ''}</td>
                            {renderEditableCell("CoolingEquipment")}
                            <td><strong>{coolingData ? (coolingData.cooling_data.CoolingSum).toFixed(0) : ''}</strong></td>
                            <td>
                                { extraAirNeeded }
                            </td>
                            <td>
                                {
                                    extraAirNeeded < 0 ? (
                                        <>
                                            Det mangler {extraAirNeeded * -1} m3/h for å dekke kjøling ved luft. <Link to="" onClick={handleUpdateVentilation}>Oppdater luftmengde</Link>
                                        </>
                                    ) : (
                                        <>
                                        </>
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

export default CoolingTableRowComponent;