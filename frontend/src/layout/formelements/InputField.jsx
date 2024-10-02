import { forwardRef } from "react";

const InputField = forwardRef((props, ref) => {
    return (
        <input
            ref={ref}
            className="
                bg-form-background-color
                dark:bg-dark-form-background-color
                border-form-border-color
                dark:border-dark-form-border-color
                text-primary-color
                dark:text-dark-primary-color
                outline-none
                w-full
                border
                pl-5
                pr-5
                text-sm
                rounded-lg
                h-9
                focus:border-form-focus-border-color
                focus:dark:border-dark-form-focus-border-color
                hover:border-form-element-hover
                hover:dark:border-dark-form-element-hover"
            onChange={props.changeFunction}
            type="text"
            value={props.value}
            name={props.name}
            placeholder={props.placeholder}
            required={props.required}
            tabIndex={props.tabIndex}
            disabled={props.disabled}
        />
    );
});

export default InputField;