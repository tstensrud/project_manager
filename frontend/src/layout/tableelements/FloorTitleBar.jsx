function FloorTitleBar(props) {
    return (
        <div className="text-grey-text dark:text-dark-grey-text text-xs border-none w-full max-w-full bg-secondary-color dark:bg-dark-secondary-color flex justify-center shadow-lg shadow-background-shade">
            <h3>Etasje {props.floor}</h3>
        </div>
    );
}

export default FloorTitleBar;