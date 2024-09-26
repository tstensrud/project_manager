import FloorTitleBar from "./FloorTitleBar";

function TableWrapper(props) {
    return (
        <div className="">
            {
                props?.floor && <FloorTitleBar floor={props.floor} />
            }
            <div className="flex flex-col mt-0 h-auto bg-secondary-color dark:bg-dark-secondary-color shadow-lg shadow-background-shade dark:shadow-none mb-5">
                <div className="flex flex-col mt-0 h-auto bg-secondary-color dark:bg-dark-secondary-color">
                    {props.children}
                </div>
            </div>
        </div>
    );
}

export default TableWrapper;