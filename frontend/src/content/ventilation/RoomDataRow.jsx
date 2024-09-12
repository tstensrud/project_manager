function RoomDataRow(props) {
    return (
        <div className="flex w-full pt-3 pb-1 pl-5 border-b border-b-default-border-color bg-secondary-color hover:bg-tertiary-color">
            <div className="flex w-1/2">
                <div className="text-sm w-full">
                    <span className="text-grey-text">
                        {props.rowName}
                    </span>
                </div>
            </div>
            <div className="flex justify-end w-1/2 pr-4 text-base">
                <strong>{props.children}</strong>
            </div>
        </div>
    );
}

export default RoomDataRow