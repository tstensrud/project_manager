import { forwardRef } from "react";

const SelectElement = forwardRef((props, ref) => {
    return (
        <select
            ref={ref}
            onChange={props.changeFunction}
            className="
                bg-secondary-color
                dark:bg-dark-secondary-color
                border-form-border-color
                dark:border-dark-default-border-color
                text-primary-color
                dark:text-dark-primary-color
                border
                rounded-lg
                text-sm
                pl-5
                pr-5
                h-9
                transition
                duration-200
                outline-none 
                focus:border-primary-color
                focus:dark:border-dark-accent-color
                focus:outline-none
                hover:border-primary-color
                hover:dark:border-dark-accent-color"
            name={props.name}
            tabIndex={props.tabIndex}
            disabled={props.disabled}
        >
            {props.children}
        </select>
    );
});

export default SelectElement;