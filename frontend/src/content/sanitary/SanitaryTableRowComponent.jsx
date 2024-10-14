import { useEffect, useState, useContext } from "react";

// Hooks
import useFetchRequest from '../../hooks/useFetchRequest';
import useUpdateData from '../../hooks/useUpdateData';
import { GlobalContext } from '../../context/GlobalContext';

// Components
import MessageBox from '../../layout/MessageBox';
import LoadingRow from '../../layout/tableelements/LoadingRow.jsx';
import MarkedRow from "../../layout/tableelements/MarkedRow.jsx";
import EditableTableCell from "../../layout/tableelements/EditableTableCell.jsx";

// SVG
import MarkRowIcon from '../../assets/svg/MarkRowIcon.jsx';
import EditableInputField from "../../layout/tableelements/EditableInputField.jsx";
import TableTDelement from "../../layout/tableelements/TableTDelement.jsx";


function SanitaryTableRowComponent({ buildingReFetch, roomData, totalColumns }) {
    const { activeProject } = useContext(GlobalContext);
    const [serverSuccesFalseMsg, setServerSuccesFalseMsg] = useState(null);

    // Initial fetches and refetch
    const { data: updatedSanitaryData, loading: sanitaryLoading, error: sanitaryError, fetchData: sanitaryRefetch } = useFetchRequest(`/project_api/${activeProject}/rooms/get_room/${roomData.roomData.uid}/`);

    // Update data
    const { response: updateDataResponse, setData, handleSubmit: updateRoomData } = useUpdateData(`/project_api/${activeProject}/sanitary/update_room/${roomData.roomData.uid}/`);

    // Edit of values
    const [editingCell, setEditingCell] = useState(null);

    // Marking a row
    const [markedRow, setMarkedRow] = useState('');

    // useEffects
    useEffect(() => {
        if (updateDataResponse?.success === true) {
            sanitaryRefetch();
        } else if (updateDataResponse?.success === false) {
            setServerSuccesFalseMsg(updateDataResponse.message);
        }
        setData('');
    }, [updateDataResponse])


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
        if (markedRow === '') {
            setMarkedRow('bg-marked-row dark:bg-dark-marked-row text-primary-color dark:text-dark-primary-color hover:bg-marked-row dark:hover:bg-dark-marked-row');
        } else {
            setMarkedRow('');
        }
    }

    const renderEditableCell = (cellName, width) => (
        <TableTDelement pointer={true} width={width} name={cellName} clickFunction={() => handleEdit(cellName)}>
            {
                editingCell === cellName && roomData ? (
                    <EditableInputField changeFunction={(e) => handleChange(e, cellName)} blur={handleBlur} keyDown={handleKeyDown} />
                ) : (
                    <EditableTableCell>
                        {!updatedSanitaryData ? roomData?.roomData[cellName] : updatedSanitaryData?.data?.roomData[cellName]}
                    </EditableTableCell>
                )
            }
        </TableTDelement>
    );

    return (
        <>
            {sanitaryError && <MessageBox setServerSuccesFalseMsg={setServerSuccesFalseMsg} message={sanitaryError} closeable={true} />}
            {serverSuccesFalseMsg ? <MessageBox setServerSuccesFalseMsg={setServerSuccesFalseMsg} closeable={true} message={serverSuccesFalseMsg} /> : null}
            <MarkedRow markedRow={markedRow}>
                {
                    sanitaryLoading ? (
                        <LoadingRow cols={totalColumns} />
                    ) : (
                        <>
                            {
                                roomData ? (
                                    <>
                                        <TableTDelement width="2%" clickFunction={handleOnMarkedRow}>
                                            <MarkRowIcon />
                                        </TableTDelement>

                                        <TableTDelement width="12%">
                                            <div className="font-semibold">
                                                {roomData?.roomData?.RoomNumber}
                                            </div>
                                            <div className="text-grey-text dark:text-dark-grey-text uppercase font-semibold">
                                                {roomData?.roomData?.RoomName}
                                            </div>
                                        </TableTDelement>
                                        {renderEditableCell("shaft", "5%")}
                                        {renderEditableCell("sink_1_14_inch", "5%")}
                                        {renderEditableCell("sink_large", "5%")}
                                        {renderEditableCell("drinking_fountain", "5%")}
                                        {renderEditableCell("sink_utility", "5%")}
                                        {renderEditableCell("wc", "5%")}
                                        {renderEditableCell("urinal", "5%")}
                                        {renderEditableCell("dishwasher", "5%")}
                                        {renderEditableCell("shower", "5%")}
                                        {renderEditableCell("tub", "5%")}
                                        {renderEditableCell("washing_machine", "5%")}
                                        {renderEditableCell("tap_water_outlet_inside", "5%")}
                                        {renderEditableCell("tap_water_outlet_outside", "5%")}
                                        {renderEditableCell("firehose", "5%")}
                                        {renderEditableCell("drain_75_mm", "5%")}
                                        {renderEditableCell("drain_110_mm", "5%")}
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

export default SanitaryTableRowComponent;