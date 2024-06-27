function SpecTableRowComponent({rowData}) {
        const listRowData = rowData.map((item, index) => <td key={index}>{item.text}</td>);
    return (
        <>
        <tr>
            {listRowData}
        </tr>
        </>
    );
}

export default SpecTableRowComponent;