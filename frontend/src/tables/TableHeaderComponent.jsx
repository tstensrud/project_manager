function TableHeaderComponent({headers}) {

    const columnTitles = headers.map((item, index) =><th key={index} dangerouslySetInnerHTML={{ __html: item.text }}/>);

    return (
        <>
            <tr>
                {columnTitles}
            </tr>
        </>
    );
}

export default TableHeaderComponent;