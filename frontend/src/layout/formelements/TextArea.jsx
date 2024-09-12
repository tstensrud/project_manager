import { forwardRef } from "react";

const TextArea = forwardRef((props, ref) => {
    return (
        <textarea
            name={props.name}
            onChange={props.changeFunction}
            ref={ref}
            className="bg-tertiary-color border-2 border-form-border-color rounded-md text-primary-color text-base p-1 w-full h-52 hover:border-form-border-color focus:border-form-focus-border-color focus:outline-none"
            tabIndex={props.tabIndex}
            required={props.required}
            >
        </textarea>
    );
});

export default TextArea;