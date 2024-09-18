import { forwardRef } from "react";

const SelectElement = forwardRef((props, ref) => {
    return (
        <select
            ref={ref}
            onChange={props.changeFunction}
            className="
                bg-form-background-color
                dark:bg-dark-form-background-color
                border-form-border-color
                dark:border-dark-form-border-color
                text-primary-color
                dark:text-dark-primary-color
                border-2
                rounded-3xl
                text-sm
                pl-5
                pr-5
                h-9
                transition
                duration-200
                outline-none 
                focus:border-form-focus-border-color
                focus:dark:border-dark-form-focus-border-color
                focus:outline-none
                hover:border-form-element-hover
                hover:dark:border-dark-form-element-hover"
            name={props.name}
            tabIndex={props.tabIndex}
            disabled={props.disabled}
        >
            {props.children}
        </select>
    );
});

export default SelectElement;