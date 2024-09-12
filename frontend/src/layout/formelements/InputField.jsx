import { forwardRef } from "react";

const InputField = forwardRef((props, ref) => {
    return (
        <input
            ref={ref}
            className="bg-form-background-color outline-none w-full border-2 border-form-border-color text-primary-color pl-5 pr-5 text-sm rounded-3xl h-9 focus:border-form-focus-border-color hover:border-form-element-hover"
            onChange={props.changeFunction}
            type="text"
            value={props.value}
            name={props.name}
            placeholder={props.placeholder}
            required={props.required}
            tabIndex={props.tabIndex}
        />
    );
});

export default InputField;