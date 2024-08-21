import { useEffect, useState, useContext } from "react";
import { useParams } from 'react-router-dom';
import { GlobalContext } from '../../GlobalContext';

import MessageBox from '../../layout/MessageBox';
import useFetch from '../../hooks/useFetch';
import useUpdateData from '../../hooks/useUpdateData';


function CoolingTableRowComponent({ roomId, msgToParent, settingsUpdateState, totalColumns, index }) {
    const { projectId } = useParams();
    const { activeProject, setActiveProject, token, setToken } = useContext(GlobalContext);


    // Initial fetches and refetch
    const { data: coolingData, loading: coolingLoading, error: coolingError, refetch: coolingRefetch } = useFetch(`/project_api/${projectId}/cooling/get_room/${roomId}/`);

    // Update data
    const { data: updatedRoomData, response, setData, handleSubmit: updateRoomData } = useUpdateData(`/project_api/${projectId}/cooling/update_room/${roomId}/`);

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
        }
    }, [coolingData]);

    // Handlers
    const sendMessageToParent = (msg) => {
        msgToParent(msg);
    }

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
            coolingRefetch();
            //sendMessageToParent("updateSummaries");
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
    if (response && response.error !== null && response.error !== undefined) return (<><MessageBox message={response.error} /></>);
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
                                {coolingData && (
                                    (() => {
                                        const { SumInternalHeatLoad, CoolingSum, VentairTempSummer, RoomTempSummer } = coolingData.cooling_data;
                                        const calculatedValue = (SumInternalHeatLoad - CoolingSum) / (0.35 * (VentairTempSummer - RoomTempSummer));

                                        return calculatedValue < 0 ? calculatedValue.toFixed(0) : null;
                                    })()
                                )}
                            </td>
                            <td>

                            </td>
                        </>
                    )
                }

            </tr>
        </>
    );
}

export default CoolingTableRowComponent;