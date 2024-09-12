import { useEffect, useState, useContext } from "react";
import { useParams } from 'react-router-dom';
import { GlobalContext } from '../../GlobalContext';

// Hooks
import useFetch from '../../hooks/useFetch';
import useUpdateData from '../../hooks/useUpdateData';

// Components
import MessageBox from '../../layout/MessageBox';

// SVG
import MarkRowIcon from '../../assets/svg/MarkRowIcon.jsx';
import EditableInputField from "../../layout/tableelements/EditableInputField.jsx";
import TableTDelement from "../../layout/tableelements/TableTDelement.jsx";


function SanitaryTableRowComponent({ roomId, buildingReFetch, index, allRoomData, totalColumns }) {
    const { projectId } = useParams();
    const { activeProject, setActiveProject, token, setToken } = useContext(GlobalContext);
    //console.log(allRoomData);


    // Initial fetches and refetch
    const { data: sanitaryData, loading: sanitaryLoading, error: sanitaryError, refetch: sanitaryRefetch } = useFetch(`/project_api/${projectId}/sanitary/get_room/${roomId}/`);

    // Update data
    const { data: updatedRoomData, response, setData, handleSubmit: updateRoomData } = useUpdateData(`/project_api/${projectId}/sanitary/update_room/${roomId}/`);


    // Edit of values
    const [editingCell, setEditingCell] = useState(null);
    const [editedData, setEditedData] = useState(null);

    // Marking a row
    const [markedRow, setMarkedRow] = useState('');

    // Roomdata
    const [showRoomData, setShowRoomData] = useState(false);

    // useEffects
    useEffect(() => {
        if (sanitaryData) {
            setEditedData('');
        }
    }, [sanitaryData]);


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
            sanitaryRefetch();
            buildingReFetch();
        } if (e.key == "Escape") {
            handleBlur();
            return;
        }
    };

    const handleOnMarkedRow = () => {
        if (markedRow === '') {
            setMarkedRow('bg-marked-row text-primary-color');
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

            {response && response.error ? <MessageBox message={response.error} /> : null}
            <tr className={`${markedRow} hover:bg-table-hover`}>
                {
                    sanitaryLoading && sanitaryLoading === true ? (
                        <>
                            {
                                Array.from({ length: totalColumns }).map((_, index) => (
                                    <td className="blur-sm opacity-50" key={index}>####</td>
                                ))
                            }
                        </>
                    ) : (
                        <>
                            <TableTDelement width="2%" clickFunction={handleOnMarkedRow}>
                                <MarkRowIcon />
                            </TableTDelement>

                            <TableTDelement width="12%">
                                <div className="font-semibold">
                                {allRoomData ? allRoomData.RoomNumber : ''}
                                </div>
                                <div className="text-grey-text uppercase font-semibold">
                                    {allRoomData ? allRoomData.RoomName : ''}
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