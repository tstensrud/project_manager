import { useState } from "react";

// Components
import TableTDelement from "../../layout/tableelements/TableTDelement.jsx";
function SanitaryShaftTableRowComponent({ data, shaft, floor }) {

    // Marking a row
    const [markedRow, setMarkedRow] = useState('');

    // Handlers
    const handleOnMarkedRow = () => {
        if (markedRow === '') {
            setMarkedRow('bg-marked-row dark:bg-dark-marked-row text-primary-color dark:text-dark-primary-color hover:bg-marked-row dark:hover:bg-dark-marked-row');
        } else {
            setMarkedRow('');
        }
    }

    return (
        <tr className={`${markedRow} hover:bg-table-hover hover:dark:bg-dark-table-hover`}>
            <TableTDelement width="12%" pointer={true} clickFunction={handleOnMarkedRow}>{floor}</TableTDelement>
            <TableTDelement width="12%" pointer={true} clickFunction={handleOnMarkedRow}>{data?.cumulative_sum_cold_water.toFixed(2)}</TableTDelement>
            <TableTDelement width="12%" pointer={true} clickFunction={handleOnMarkedRow}>{data?.cumulative_sum_hot_water.toFixed(2)}</TableTDelement>
            <TableTDelement width="12%" pointer={true} clickFunction={handleOnMarkedRow}>{data?.cumulative_sum_drainage.toFixed(2)}</TableTDelement>
            <TableTDelement width="12%" pointer={true} clickFunction={handleOnMarkedRow}>{data?.pipe_size_cold_water}</TableTDelement>
            <TableTDelement width="12%" pointer={true} clickFunction={handleOnMarkedRow}>{data?.pipe_size_warm_water}</TableTDelement>
            <TableTDelement width="12%" pointer={true} clickFunction={handleOnMarkedRow}>{data?.pipe_size_1_60}</TableTDelement>
            <TableTDelement width="12%" pointer={true} clickFunction={handleOnMarkedRow}>{data?.pipe_size_vertical}</TableTDelement>
        </tr>
    );
}

export default SanitaryShaftTableRowComponent;