function TableContainer(props) {
    return (
        <div className="flex flex-col h-[80%] overflow-y-auto">
            {props.children}
        </div>
    );
}

export default TableContainer