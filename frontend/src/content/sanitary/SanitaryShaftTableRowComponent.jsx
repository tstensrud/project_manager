import { useState } from "react";

// Components
import TableTDelement from "../../layout/tableelements/TableTDelement.jsx";
function SanitaryShaftTableRowComponent({ data, shaft, floor, name }) {

    // Marking a row
    const [markedRow, setMarkedRow] = useState('');

    // Handlers
    const handleOnMarkedRow = () => {
        if (markedRow === '') {
            setMarkedRow('bg-marked-row text-primary-color');
        } else {
            setMarkedRow('');
        }
    }

    return (
        <tr className={`${markedRow} hover:bg-table-hover`}>
            <TableTDelement pointer={true} clickFunction={handleOnMarkedRow}>{name}</TableTDelement>
            <TableTDelement pointer={true} clickFunction={handleOnMarkedRow}>{shaft}</TableTDelement>
            <TableTDelement pointer={true} clickFunction={handleOnMarkedRow}>{floor}</TableTDelement>
            <TableTDelement pointer={true} clickFunction={handleOnMarkedRow}>{data.cumulative_sum_cold_water.toFixed(2)}</TableTDelement>
            <TableTDelement pointer={true} clickFunction={handleOnMarkedRow}>{data.cumulative_sum_hot_water.toFixed(2)}</TableTDelement>
            <TableTDelement pointer={true} clickFunction={handleOnMarkedRow}>{data.cumulative_sum_drainage.toFixed(2)}</TableTDelement>
            <TableTDelement pointer={true} clickFunction={handleOnMarkedRow}>{data.pipe_size_cold_water}</TableTDelement>
            <TableTDelement pointer={true} clickFunction={handleOnMarkedRow}>{data.pipe_size_warm_water}</TableTDelement>
            <TableTDelement pointer={true} clickFunction={handleOnMarkedRow}>{data.pipe_size_1_60}</TableTDelement>
            <TableTDelement pointer={true} clickFunction={handleOnMarkedRow}>{data.pipe_size_vertical}</TableTDelement>
        </tr>
    );
}

export default SanitaryShaftTableRowComponent;