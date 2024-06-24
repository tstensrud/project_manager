import TableHeaderComponent from "./TableHeaderComponent";
import TableRowComponent from "./TableRowComponent";

function Table({headers, rows}) {
    const listHeaders = (<TableHeaderComponent headers={headers}/>);

    const listRows = rows.map((row, rowIndex) => (
    <TableRowComponent key={rowIndex}  rowData={row} />
    ));

    return (
        <>
            <div className="table-wrapper">
                <table className="fl-table" id="roomsTableVentilation">
                    <thead>
                        {listHeaders}
                    </thead>
                    <tbody>
                        {listRows}
                    </tbody>
                </table>
            </div>
        </>
    );
}

export default Table;