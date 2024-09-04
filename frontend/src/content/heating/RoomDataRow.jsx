function RoomDataRow(props) {
    return (
        <tr>
            <td className="grey-text">
                {props.rowName}
            </td>
            <td>
                {props.rowData}
                {props.children}
            </td>
        </tr>
    );
}

export default RoomDataRow