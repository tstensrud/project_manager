function TableSelect(props) {
    return (
        <select
            value={props.value}
            name={props.name}
            className="
            top-0
            bottom-0
            w-full
            h-full
            pl-2
            pr-2
            bg-secondary-color
            dark:bg-dark-secondary-color border-none
            border-form-border-color
            dark:border-dark-form-border-color
            text-primary-color
            dark:text-dark-primary-color
            text-sm
            transition
            duration-200 
            hover:border-form-element-hover
            hover:dark:border-dark-form-element-hover"
            onChange={props.changeFunction}>
            {props.children}
        </select>
    );
}

export default TableSelect;