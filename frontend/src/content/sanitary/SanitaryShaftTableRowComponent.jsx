import { useState } from "react";


function SanitaryShaftTableRowComponent({data, shaft, floor, name}) {

    // Marking a row
    const [markedRow, setMarkedRow] = useState('');



    // Handlers
    const handleOnMarkedRow = () => {
        if (markedRow === '') {
            setMarkedRow('marked-row');
        } else {
            setMarkedRow('');
        }
    }

    return (
        <>
            <tr className={markedRow}>
                <td style={{ cursor: 'pointer', height: "30px" }} onClick={handleOnMarkedRow}>{name}</td>
                <td style={{ cursor: 'pointer', height: "30px" }} onClick={handleOnMarkedRow}>{shaft}</td>
                <td style={{ cursor: 'pointer', height: "30px" }} onClick={handleOnMarkedRow}>{floor}</td>
                <td style={{ cursor: 'pointer', height: "30px" }} onClick={handleOnMarkedRow}>{data.cumulative_sum_cold_water.toFixed(2)}</td>
                <td style={{ cursor: 'pointer', height: "30px" }} onClick={handleOnMarkedRow}>{data.cumulative_sum_hot_water.toFixed(2)}</td>
                <td style={{ cursor: 'pointer', height: "30px" }} onClick={handleOnMarkedRow}>{data.cumulative_sum_drainage.toFixed(2)}</td>
                <td style={{ cursor: 'pointer', height: "30px" }} onClick={handleOnMarkedRow}>{data.pipe_size_cold_water}</td>
                <td style={{ cursor: 'pointer', height: "30px" }} onClick={handleOnMarkedRow}>{data.pipe_size_warm_water}</td>
                <td style={{ cursor: 'pointer', height: "30px" }} onClick={handleOnMarkedRow}>{data.pipe_size_1_60}</td>
                <td style={{ cursor: 'pointer', height: "30px" }} onClick={handleOnMarkedRow}>{data.pipe_size_vertical}</td>
            </tr>
        </>
    );
}

export default SanitaryShaftTableRowComponent;