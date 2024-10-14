import React, { forwardRef } from 'react';

const CardInputField = forwardRef((props, ref) => {
    return (
        <div>
            <input
                ref={ref}
                className="
            bg-tertiary-color
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
            dark:hover:border-dark-accent-color
            transition
            duration-200
            "
                onChange={props?.changeFunction}
                type={props?.password ? 'password' : 'text'}
                value={props?.value}
                name={props?.name}
                placeholder={props?.placeholder}
                required={props?.required}
                tabIndex={props?.tabIndex}
                disabled={props.disabled}
            />
        </div>
    );
});

export default CardInputField;