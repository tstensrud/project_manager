function Table(props) {
    return (
        <div className="sticky overflow-hidden ml-5 mr-5 mt-0 top-0 bg-secondary-color dark:bg-dark-secondary-color z-10">
            <table className="text-primary-color dark:text-dark-primary-color text-xs border-none border-collapse w-full max-w-full whitespace-nowrap">
                {props.children}
            </table>
        </div>
    );
}

export default Table;