import TableHeaderComponent from "./TableHeaderComponent";
import SpecTableRowComponent from "./SpecTableRowComponent";

function Table({headers, rows}) {
    const listHeaders = (<TableHeaderComponent headers={headers}/>);

    const listRows = rows.map((row, rowIndex) => (
    <SpecTableRowComponent key={rowIndex}  rowData={row} />
    ));

    return (
        <>
            <div className="table-wrapper">
                <table className="fl-table">
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