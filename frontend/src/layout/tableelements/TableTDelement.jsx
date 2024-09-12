function TableTDelement(props) {
    
    return (
        <td
        className={`
        ${props?.pointer && props.pointer === true ? `cursor-pointer` : ''}
        ${props?.cellClass && props.cellClass === "supply" && 'bg-supply-color font-bold text-secondary-color'}
        ${props?.cellClass && props.cellClass === "extract" && 'bg-extract-color font-bold text-secondary-color'}
        text-center box-border border-t-table-border-color border-b-table-border-color border-t border-b text-xs overflow-hidden
        `}
        name={props.name}
        onClick={props.clickFunction ? props.clickFunction : null}
        style={props.width ? {width: props.width } : {}}
        >
            {props.children}
        </td>
    );
}

export default TableTDelement;