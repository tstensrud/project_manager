import { forwardRef } from "react";

const TextArea = forwardRef((props, ref) => {
    return (
        <textarea
            name={props.name}
            onChange={props.changeFunction}
            ref={ref}
            className="
            bg-tertiary-color
            border
            dark:bg-dark-secondary-color
            border-form-border-color
            dark:border-dark-default-border-color
            rounded-md
            text-primary-color
            dark:text-dark-primary-color
            text-base
            p-1
            w-full
            h-52
            hover:border-form-border-color
            hover:dark:border-dark-default-border-color
            focus:border-primary-color
            focus:dark:border-dark-accent-color
            focus:outline-none"
            tabIndex={props.tabIndex}
            required={props.required}
            value={props.value}
            >
        </textarea>
    );
});

export default TextArea;