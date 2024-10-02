function TableTDelement(props) {
    
    return (
        <td
        className={`
        ${props?.pointer && props.pointer === true ? `cursor-pointer` : ''}
        ${props?.cellClass && props.cellClass === "supply" && 'bg-supply-color text-secondary-color dark:text-dark-primary-color'}
        ${props?.cellClass && props.cellClass === "extract" && 'bg-extract-color text-secondary-color dark:text-dark-primary-color'}
        ${props?.cellClass && props.cellClass === "grey" && 'text-grey-text dark:text-dark-grey-text'}
        text-center
        box-border
        h-10
        border-table-border-color
        dark:border-dark-table-border-color
        border-t
        
        text-sm
        overflow-hidden
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