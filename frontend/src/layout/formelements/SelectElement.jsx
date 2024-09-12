import { forwardRef } from "react";

const SelectElement = forwardRef((props, ref) => {
    return (
        <select 
            ref={ref}
            onChange={props.changeFunction}
            className="bg-form-background-color text-primary-color border-2 border-form-border-color rounded-3xl text-sm pl-5 pr-5 h-9 transition duration-200 outline-none hover:border-form-element-hover focus:border-form-focus-border-color"
            name={props.name}
            tabIndex={props.tabIndex}
            >
            {props.children}
        </select>
    );
});

export default SelectElement;