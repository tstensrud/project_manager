function TableTHelement(props) {
    return (
        <>
        <th
        className={`text-center pt-1 pb-3 box-border text-grey-text top-0 sticky h-6 z-10 text-base tracking-wide `}
        style={props.width ? {width: props.width} : {}}
        >
            {props.text}
            {props.children}
        </th>
        </>
    );
}

export default TableTHelement;