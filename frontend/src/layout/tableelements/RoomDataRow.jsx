function RoomDataRow(props) {
    return (
        <div className="flex w-full pt-1 pb-1 pl-5 border-b border-default-border-color dark:border-default-border-color bg-secondary-color dark:bg-dark-secondary-color hover:bg-tertiary-color hover:dark:bg-dark-tertiary-color">
            <div className="flex w-1/2 justify-center">
                <div className="text-base w-full">
                    <span className="text-grey-text dark:text-dark-grey-text">
                        {props.rowName}
                    </span>
                </div>
            </div>
            <div className="flex justify-end w-1/2 pr-4 text-base font-semibold break-words whitespace-normal">
                {props.children}
            </div>
        </div>
    );
}

export default RoomDataRow