function MarkedRow(props) {

    return (
        <tr  className=
            {
                props.markedRow ?
                    `bg-marked-row dark:bg-dark-marked-row text-primary-color dark:text-dark-primary-color hover:bg-marked-row hover:dark:bg-dark-marked-row ` :
                    `hover:bg-table-hover hover:dark:bg-dark-table-hover`
            }
        >
            {props.children}
        </tr>
    );
}

export default MarkedRow;