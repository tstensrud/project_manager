import { useEffect, useContext, useState } from "react";
import { Link } from 'react-router-dom';

// Hooks and utils
import useFetchRequest from '../../hooks/useFetchRequest';
import useUpdateData from '../../hooks/useUpdateData';
import { GlobalContext } from '../../context/GlobalContext';

// Components
import MessageBox from '../../layout/MessageBox';
import MarkedRow from "../../layout/tableelements/MarkedRow.jsx";
import EditableTableCell from "../../layout/tableelements/EditableTableCell.jsx";

// SVG
import MarkRowIcon from '../../assets/svg/MarkRowIcon.jsx';
import EditableInputField from "../../layout/tableelements/EditableInputField.jsx";
import TableTDelement from "../../layout/tableelements/TableTDelement.jsx";
import LoadingRow from "../../layout/tableelements/LoadingRow.jsx";



function CoolingTableRowComponent({ roomData, settingsUpdatedState, totalColumns }) {
    const { activeProject } = useContext(GlobalContext);

    const [extraAirNeeded, setExtraAirNeeded] = useState(0)
    const [currentSettingsCounter, setCurrentSettingsCounter] = useState(0);
    const [serverSuccesFalseMsg, setServerSuccesFalseMsg] = useState(null);

    // Initial fetches and refetch
    const { data: updatedCoolingData, loading: coolingLoading, error: coolingError, fetchData: coolingRefetch } = useFetchRequest(`/project_api/${activeProject}/rooms/get_room/${roomData.roomData.uid}/`);

    // Update data
    const { response: updateRoomDataResponse, setData, handleSubmit: updateRoomData, loading: updateCoolingDataLoading } = useUpdateData(`/project_api/${activeProject}/cooling/update_room/${roomData.roomData.uid}/`);
    const { response: updateVentDataResponse, setData: setUpdateVentData, handleSubmit: updateVentilationDataSubmit } = useUpdateData(`/project_api/${activeProject}/ventilation/update_room/${roomData.roomData.uid}/1/`);

    // Edit of values
    const [editingCell, setEditingCell] = useState(null);

    // Marking a row
    const [markedRow, setMarkedRow] = useState(false);

    // useEffects
    useEffect(() => { // Refetch upon received message that cooling settings has changed
        if (settingsUpdatedState > currentSettingsCounter) {
            coolingRefetch();
            setCurrentSettingsCounter(prevCounter => prevCounter + 1);
        }
    }, [settingsUpdatedState]);

    useEffect(() => {
        if (roomData) {
            calculateExtraAirNeeded();
        }
    }, [roomData]);

    useEffect(() => {
        if (updatedCoolingData?.success) {
            calculateExtraAirNeeded();
        } else if (updatedCoolingData?.success === false) {
            setServerSuccesFalseMsg(updatedCoolingData.message);
        }
    }, [updatedCoolingData]);

    useEffect(() => {
        if (updateVentDataResponse?.success) {
            coolingRefetch();
        } else if (updateVentDataResponse?.success === false) {
            setServerSuccesFalseMsg(updateVentDataResponse?.message);
        }
        if (updateRoomDataResponse?.success) {
            setData({});
            coolingRefetch();
        } else if (updateRoomDataResponse?.success === false) {
            setServerSuccesFalseMsg(updateRoomDataResponse.message)
        }
        setUpdateVentData({});
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
        const { SumInternalHeatLoad, CoolingSum, VentairTempSummer, RoomTempSummer } = !updatedCoolingData ? roomData : updatedCoolingData?.data.roomData;
        const calculatedValue = (SumInternalHeatLoad - CoolingSum) / (0.35 * (VentairTempSummer - RoomTempSummer));
        const airFlow = !updatedCoolingData ? roomData?.AirSupply : updatedCoolingData?.data.roomData.AirSupply;
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
                editingCell === cellName && roomData ? (
                    <EditableInputField changeFunction={(e) => handleChange(e, cellName)} blur={handleBlur} keyDown={handleKeyDown} />
                ) : (
                    <EditableTableCell>
                        {!updatedCoolingData ? roomData.roomData[cellName] : updatedCoolingData?.data?.roomData[cellName]}
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
            {serverSuccesFalseMsg && <MessageBox setServerSuccesFalseMsg={setServerSuccesFalseMsg}  closeable={true} message={serverSuccesFalseMsg} />}
            {coolingError && <MessageBox setServerSuccesFalseMsg={setServerSuccesFalseMsg} closeable={true} message={coolingError} />}
            <MarkedRow markedRow={markedRow}>
                {
                    coolingLoading || updateCoolingDataLoading ? (
                        <LoadingRow cols={totalColumns} />
                    ) : (
                        <>
                            {
                                roomData ? (
                                    <>
                                        <TableTDelement width="2%" clickFunction={handleOnMarkedRow}>
                                            <MarkRowIcon />
                                        </TableTDelement>
                                        <TableTDelement width="5%">
                                            <div className="flex flex-col">
                                                <div className="text-accent-color dark:text-dark-accent-color hover:text-primary-color hover:dark:text-dark-primary-color transition duration-200 font-semibold">
                                                    {roomData?.roomData.RoomNumber}
                                                </div>
                                                <div className="text-grey-text dark:text-dark-grey-text uppercase">
                                                    {roomData?.roomData.RoomName}
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
                                            {!updatedCoolingData ? roomData?.roomData.SumInternalHeatLoad : updatedCoolingData.data.roomData.SumInternalHeatLoad}
                                        </TableTDelement>
                                        {renderEditableCell("CoolingEquipment", "5%")}
                                        <TableTDelement width="5%">
                                            <strong>
                                                {!updatedCoolingData ? roomData?.roomData.CoolingSum : updatedCoolingData.data.roomData.CoolingSum}
                                            </strong>
                                        </TableTDelement>
                                        <TableTDelement width="5%">
                                            {
                                                extraAirNeeded === 0 ? '' : <>{extraAirNeeded}</>
                                            }
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

export default CoolingTableRowComponent;