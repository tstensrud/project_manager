function Table(props) {
    return (
        <table className="text-primary-color dark:text-dark-primary-color text-xs border-none border-collapse w-full max-w-full whitespace-nowrap">
            {props.children}
        </table>
    );
}

export default Table;