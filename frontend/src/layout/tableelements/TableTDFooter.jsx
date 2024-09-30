function TableTDFooter(props) {
    
    return (
        <td
        className={`
        text-center
        box-border
        h-10
        text-sm
        overflow-hidden
        text-wrap
        `}
        style={props.width ? {width: props.width } : {}}
        >
            {props.children}
        </td>
    );
}

export default TableTDFooter;