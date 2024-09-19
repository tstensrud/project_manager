import { useEffect, useState, useContext } from "react";
import { useParams } from 'react-router-dom';

// Hooks
import useFetch from '../../hooks/useFetch';
import useUpdateData from '../../hooks/useUpdateData';

// Components
import MessageBox from '../../layout/MessageBox';
import LoadingRow from '../../layout/tableelements/LoadingRow.jsx';

// SVG
import MarkRowIcon from '../../assets/svg/MarkRowIcon.jsx';
import EditableInputField from "../../layout/tableelements/EditableInputField.jsx";
import TableTDelement from "../../layout/tableelements/TableTDelement.jsx";


function SanitaryTableRowComponent({ buildingReFetch, roomId, totalColumns }) {
    const { projectId } = useParams();
    
    // Initial fetches and refetch
    const { data: sanitaryData, loading: sanitaryLoading, error: sanitaryError, refetch: sanitaryRefetch } = useFetch(`/project_api/${projectId}/sanitary/get_room/${roomId}/`);

    // Update data
    const { response, setData, handleSubmit: updateRoomData } = useUpdateData(`/project_api/${projectId}/sanitary/update_room/${roomId}/`);


    // Edit of values
    const [editingCell, setEditingCell] = useState(null);
    const [editedData, setEditedData] = useState(null);

    // Marking a row
    const [markedRow, setMarkedRow] = useState('');

    // useEffects
    useEffect(() => {
        if (sanitaryData) {
            setEditedData('');
        }
    }, [sanitaryData]);

    useEffect(() => {
        if(response?.success === true) {
            setData('');
            sanitaryRefetch();
            buildingReFetch();
        }
    },[response])


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
            setMarkedRow('bg-marked-row text-primary-color dark:bg-dark-marked-row dark:text-dark-primary-color');
        } else {
            setMarkedRow('');
        }
    }

    const renderEditableCell = (cellName, width) => (
        <TableTDelement pointer={true} width={width} name={cellName} clickFunction={() => handleEdit(cellName)}>
            {
                editingCell === cellName && sanitaryData ? (
                    <EditableInputField value={sanitaryData[cellName]} changeFunction={(e) => handleChange(e, cellName)} blur={handleBlur} keyDown={handleKeyDown} />
                ) : (
                    sanitaryData ? sanitaryData.sanitary_data[cellName] : ''
                )
            }
        </TableTDelement>
    );
    
    return (
        <>

            {response?.success === false ? <MessageBox message={response.message} /> : null}
            <tr className={`${markedRow} hover:bg-table-hover hover:dark:bg-dark-table-hover`}>
                {
                    sanitaryLoading && sanitaryLoading === true ? (
                        <LoadingRow cols={totalColumns} />
                    ) : (
                        <>
                            <TableTDelement width="2%" clickFunction={handleOnMarkedRow}>
                                <MarkRowIcon />
                            </TableTDelement>

                            <TableTDelement width="12%">
                                <div className="font-semibold">
                                {sanitaryData?.room_data ? sanitaryData.room_data.RoomNumber : ''}
                                </div>
                                <div className="text-grey-text dark:text-dark-grey-text uppercase font-semibold">
                                    {sanitaryData?.room_data ? sanitaryData.room_data.RoomName : ''}
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
                    )
                }
            </tr>
        </>
    );
}

export default SanitaryTableRowComponent;