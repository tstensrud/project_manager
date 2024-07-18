function TableHeaderComponent({headers}) {

    const columnTitles = headers.map((item, index) =><th key={index}><span className="table-text-grey">{item.text}</span></th>);

    return (
        <>
            <tr>
                {columnTitles}
            </tr>
        </>
    );
}

export default TableHeaderComponent;