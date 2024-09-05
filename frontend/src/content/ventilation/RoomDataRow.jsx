function RoomDataRow(props) {
    return (
        <div className="room-data-row-container">
            <div className="room-data-row-left">
                <div className="room-data-row">
                    <span className="grey-text">
                        {props.rowName}
                    </span>
                </div>
            </div>
            <div className="room-data-row-right">
                <strong>{props.children}</strong>
            </div>
        </div>
    );
}

export default RoomDataRow