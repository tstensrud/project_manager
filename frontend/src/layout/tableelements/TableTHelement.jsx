function TableTHelement(props) {
    return (
        <>
        <th
        className={`text-center pt-1 pb-3 box-border text-grey-text dark:text-dark-grey-text top-0 sticky h-6 z-10 text-xs sm:text-sm xl:text-sm`}
        style={props.width ? {width: props.width} : {}}
        >
            {props.text}
            {props.children}
        </th>
        </>
    );
}

export default TableTHelement;