function TableFooter({ children }) {
    return (
        <table className="text-primary-color shadow-sm shadow-background-shade dark:text-dark-primary-color text-xs border-none border-collapse w-full max-w-full whitespace-nowrap bg-secondary-color dark:bg-dark-secondary-color rounded-bl-lg rounded-br-lg">
            <tbody>
                <tr>
                    {children}
                </tr>
            </tbody>
        </table>
    );

}

export default TableFooter;