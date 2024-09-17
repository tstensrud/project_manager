function TableContainer(props) {
    return (
        <div className="flex flex-col">
            {props.children}
        </div>
    );
}

export default TableContainer