function RoomDataMainTitle(props) {
    return (
        <div className="sticky top-0 flex items-center w-full pt-1 pb-1 pl-5 border-b border-default-border-color dark:border-default-border-color bg-tertiary-color dark:bg-dark-tertiary-color hover:bg-tertiary-color hover:dark:bg-dark-tertiary-color">
            <div className="flex w-1/2">
                <div className="text-lg font-semibold w-full">
                    {props.roomNumber} - <span className="text-grey-text dark:text-dark-grey-text">{props.roomName}</span>
                </div>
            </div>
            <div className="flex justify-end w-1/2 pr-4 text-base items-center">
                <span onClick={props.clickFunction} className="flex right-4 text-primary-color dark:text-dark-primary-color text-2xl font-bold cursor-pointer hover:text-accent-color hover:dark:text-dark-accent-color">
                    &times;
                </span>
            </div>
        </div>
    );
}

export default RoomDataMainTitle;