function Table(props) {
    return (
        <div className="sticky overflow-hidden mt-0 top-0 bg-secondary-color dark:bg-dark-secondary-color z-10">
            <table className="text-primary-color dark:text-dark-primary-color text-sm border-none border-collapse w-full max-w-full whitespace-nowrap">
                <thead>
                    <tr className="border-b border-table-border-color dark:border-dark-table-border-color">
                        {props.children}
                    </tr>
                </thead>
            </table>
        </div>
    );
}

export default Table;