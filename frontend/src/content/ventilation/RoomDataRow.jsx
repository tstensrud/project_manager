function RoomDataRow(props) {
    return (
        <tr>
            {props.rowName === "Presiseringer" ? (
                <>
                    <td className="grey-text" style={{ wordWrap: "break-word", wordBreak: "break-all", whiteSpace: "normal" }}>
                        {props.rowName}
                    </td>
                    <td>
                        {props.children}
                    </td>
                </>
            ) : (
                <>
                    <td className="grey-text">
                        {props.rowName}
                    </td>
                    <td>
                        {props.children}
                    </td>
                </>
            )}
        </tr>
    );
}

export default RoomDataRow