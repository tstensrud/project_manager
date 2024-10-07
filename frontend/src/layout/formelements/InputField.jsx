import { forwardRef } from "react";

const InputField = forwardRef((props, ref) => {
    return (
        <input
            ref={ref}
            className="
                bg-secondary-color
                dark:bg-dark-secondary-color
                border-form-border-color
                dark:border-dark-default-border-color
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
                focus:border-primary-color
                focus:dark:border-dark-accent-color
                hover:border-primary-color
                hover:dark:border-dark-accent-color"
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