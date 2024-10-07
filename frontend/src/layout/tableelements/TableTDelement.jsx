function TableTDelement(props) {
    
    return (
        <td
        className={`
        ${props?.pointer && props.pointer === true ? `cursor-pointer` : ''}
        ${props?.cellClass && props.cellClass === "supply" && 'bg-supply-color text-secondary-color dark:bg-[#021D02] dark:text-[#95DB95]'}
        ${props?.cellClass && props.cellClass === "extract" && 'bg-extract-color text-secondary-color dark:bg-[#1E0101] dark:text-[#EE9090]'}
        ${props?.cellClass && props.cellClass === "grey" && 'text-grey-text dark:text-dark-grey-text'}
        overflow-visible
        text-center
        box-border
        h-10
        border-table-border-color
        dark:border-dark-default-border-color
        border-t
        text-sm
        text-wrap
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