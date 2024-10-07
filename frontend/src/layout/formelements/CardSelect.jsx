import React, { forwardRef } from 'react';

const CardSelect = forwardRef((props, ref) => {
    return (
        <select
            ref={ref}
            onChange={props.changeFunction}
            className="
            bg-tertiary-color
            dark:bg-dark-secondary-color
            border
            border-form-border-color
            dark:border-dark-default-border-color
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
            dark:hover:border-dark-accent-color"
            name={props.name}
            tabIndex={props.tabIndex}
            >
            {props.children}
        </select>
    );
});

export default CardSelect;