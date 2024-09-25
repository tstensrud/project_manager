import React, { forwardRef } from 'react';

const CardInputField = forwardRef((props, ref) => {
    return (
        <div>
            <input
                ref={ref}
                className="
            bg-tertiary-color
            dark:bg-dark-tertiary-color
            border-form-border-color
            dark:border-dark-form-border-color
            text-primary-color
            dark:text-dark-primary-color
            outline-none
            w-auto
            border-2 
            pl-5
            pr-5
            text-sm
            rounded-3xl
            h-9
            focus:border-form-focus-border-color
            focus:dark:border-dark-form-focus-border-color
            hover:border-form-element-hover
            dark:hover:border-dark-form-element-hover
            "
                onChange={props.changeFunction}
                type={props.password ? 'password' : 'text'}
                value={props.value}
                name={props.name}
                placeholder={props.placeholder}
                required={props.required}
                tabIndex={props.tabIndex}
            />
        </div>
    );
});

export default CardInputField;