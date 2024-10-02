import { useEffect, useState } from "react";
import { Link, useParams } from 'react-router-dom';

// Hooks
import useFetch from '../../hooks/useFetch';
import useUpdateData from '../../hooks/useUpdateData';

// Components
import MessageBox from '../../layout/MessageBox';
import MarkedRow from "../../layout/tableelements/MarkedRow.jsx";
import EditableTableCell from "../../layout/tableelements/EditableTableCell.jsx";

// SVG
import MarkRowIcon from '../../assets/svg/MarkRowIcon.jsx';
import EditableInputField from "../../layout/tableelements/EditableInputField.jsx";
import TableTDelement from "../../layout/tableelements/TableTDelement.jsx";
import LoadingRow from "../../layout/tableelements/LoadingRow.jsx";



function CoolingTableRowComponent({ roomId, settingsUpdatedState, totalColumns }) {
    const { projectId } = useParams();

    const [extraAirNeeded, setExtraAirNeeded] = useState(0)

    // Initial fetches and refetch
    const { data: coolingData, loading: coolingLoading, error: coolingError, refetch: coolingRefetch } = useFetch(`/project_api/${projectId}/cooling/get_room/${roomId}/`);

    // Update data
    const { response: updateRoomDataResponse, setData, handleSubmit: updateRoomData, loading: updateCoolingDataLoading } = useUpdateData(`/project_api/${projectId}/cooling/update_room/${roomId}/`);
    const { data: updateVentilationData, response: updateVentDataResponse, setData: setUpdateVentData, handleSubmit: updateVentilationDataSubmit } = useUpdateData(`/project_api/${projectId}/ventilation/update_room/${roomId}/1/`);

    // Edit of values
    const [editingCell, setEditingCell] = useState(null);

    // Marking a row
    const [markedRow, setMarkedRow] = useState(false);

    // useEffects
    useEffect(() => { // Refetch upon received message that cooling settings has changed
        coolingRefetch();
    }, [settingsUpdatedState]);

    useEffect(() => {
        if (coolingData) {
            calculateExtraAirNeeded();
        }
    }, [coolingData]);

    useEffect(() => {
        if (updateVentDataResponse?.success === true) {
            setUpdateVentData({});
            coolingRefetch();
        }
        if (updateRoomDataResponse?.success === true) {
            setData({});
            coolingRefetch();
        }
    }, [updateVentDataResponse, updateRoomDataResponse]);

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


    const calculateExtraAirNeeded = () => {
        const { SumInternalHeatLoad, CoolingSum, VentairTempSummer, RoomTempSummer } = coolingData.cooling_data;
        const calculatedValue = (SumInternalHeatLoad - CoolingSum) / (0.35 * (VentairTempSummer - RoomTempSummer));
        const airFlow = coolingData && coolingData.cooling_data.Airflow;
        if (calculatedValue < 0) {
            setExtraAirNeeded(calculatedValue.toFixed(0));
            setUpdateVentData({ air_supply: ((calculatedValue.toFixed(0) * - 1) + airFlow), air_extract: ((calculatedValue.toFixed(0) * - 1) + airFlow) })
        } else {
            setExtraAirNeeded(0);
        }
    }

    const renderEditableCell = (cellName, width) => (
        <TableTDelement pointer={true} width={width} name={cellName} clickFunction={() => handleEdit(cellName)}>
            {
                editingCell === cellName && coolingData ? (
                    <EditableInputField value={coolingData[cellName]} changeFunction={(e) => handleChange(e, cellName)} blur={handleBlur} keyDown={handleKeyDown} />
                ) : (
                    <EditableTableCell>
                        {coolingData ? coolingData.cooling_data[cellName] : ''}
                    </EditableTableCell>
                )
            }
        </TableTDelement>
    );

    const handleUpdateVentilation = async (e) => {
        e.preventDefault();
        await updateVentilationDataSubmit();
    }

    return (
        <>
            {updateRoomDataResponse?.success === false && <MessageBox message={updateRoomDataResponse.message} />}
            {coolingError && <MessageBox message={coolingError} /> }
            <MarkedRow markedRow={markedRow}>
                {
                    coolingLoading || updateCoolingDataLoading ? (
                        <LoadingRow cols={totalColumns} />
                    ) : (
                        <>
                            <TableTDelement width="2%" clickFunction={handleOnMarkedRow}>
                                <MarkRowIcon />
                            </TableTDelement>
                            <TableTDelement width="5%">
                            <div className="flex flex-col">
                                    <div className="text-accent-color dark:text-dark-accent-color hover:text-primary-color hover:dark:text-dark-primary-color transition duration-300 font-semibold">
                                        {coolingData && coolingData.room_data.RoomNumber}
                                    </div>
                                    <div className="text-grey-text dark:text-dark-grey-text uppercase">
                                        {coolingData && coolingData.room_data.RoomName}
                                    </div>
                                </div>
                            </TableTDelement>
                            {renderEditableCell("RoomTempSummer", "5%")}
                            {renderEditableCell("VentairTempSummer", "5%")}
                            {renderEditableCell("InternalHeatloadPeople", "5%")}
                            {renderEditableCell("InternalHeatloadLights", "5%")}
                            {renderEditableCell("InternalHeatloadEquipment", "5%")}
                            {renderEditableCell("SunAdition", "5%")}
                            {renderEditableCell("SunReduction", "5%")}
                            <TableTDelement width="5%">
                                {coolingData ? coolingData.cooling_data.SumInternalHeatLoad : ''}
                            </TableTDelement>
                            {renderEditableCell("CoolingEquipment", "5%")}
                            <TableTDelement width="5%">
                                <strong>
                                    {coolingData ? (coolingData.cooling_data.CoolingSum).toFixed(0) : ''}
                                </strong>
                            </TableTDelement>
                            <TableTDelement width="5%">
                                {extraAirNeeded}
                            </TableTDelement>
                            <TableTDelement width="34%">
                                {
                                    extraAirNeeded < 0 && (
                                        <>
                                            Det mangler {extraAirNeeded * -1} m3/h for å dekke kjøling ved luft. <Link to="" onClick={handleUpdateVentilation}>Oppdater luftmengde</Link>
                                        </>
                                    )
                                }
                            </TableTDelement>
                        </>
                    )
                }
            </MarkedRow>
        </>
    );
}

export default CoolingTableRowComponent;