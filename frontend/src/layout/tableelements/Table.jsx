function Table(props) {
    return (
        <div className="pb-3">
            <div className="`flex overflow-y-auto flex-col transition-all duration-700 ease-in-out mt-0 bg-secondary-color dark:bg-dark-secondary-color shadow-lg shadow-background-shade dark:shadow-none">
                <div className="flex flex-col mt-0 h-auto bg-secondary-color dark:bg-dark-secondary-color">
                    <table className="text-primary-color dark:text-dark-primary-color text-xs border-none border-collapse w-full max-w-full whitespace-nowrap">
                        {props.children}
                    </table>
                </div>
            </div>
        </div>
    );
}

export default Table;