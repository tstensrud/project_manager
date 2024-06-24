function TableHeaderComponent({headers}) {

    const columnTitles = headers.map((item, index) =><th key={index}> {item.text} </th>);

    return (
        <>
            <tr>
                {columnTitles}
            </tr>
        </>
    );
}

export default TableHeaderComponent;