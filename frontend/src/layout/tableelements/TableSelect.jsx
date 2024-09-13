function TableSelect(props) {
    return (
        <select
            value={props.value}
            name={props.name}
            className="pl-2 pr-2 bg-secondary-color dark:bg-dark-secondary-color border-2 border-form-border-color dark:border-dark-form-border-color text-primary-color dark:text-dark-primary-color text-sm h-8 transition duration-200 rounded-3xl hover:border-form-element-hover hover:dark:border-dark-form-element-hover"
            onChange={props.changeFunction}>
            {props.children}
        </select>
    );
}

export default TableSelect;