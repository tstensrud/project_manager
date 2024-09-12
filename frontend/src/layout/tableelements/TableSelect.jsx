function TableSelect(props) {
    return (
        <select
            value={props.value}
            name={props.name}
            className="pl-2 pr-1 bg-secondary-color border-2 border-form-border-color text-primary-color text-xs h-5 transition duration-200 rounded-3xl hover:border-form-element-hover "
            onChange={props.changeFunction}>
            {props.children}
        </select>
    );
}

export default TableSelect;