import React, { forwardRef } from 'react';

const CardSelect = forwardRef((props, ref) => {
    return (
        <select
            ref={ref}
            onChange={props.changeFunction}
            className="
            bg-tertiary-color
            dark:bg-dark-tertiary-color
            border-2
            border-form-border-color
            dark:border-dark-form-border-color
            rounded-3xl text-sm pl-5 pr-5 h-9 transition duration-200 outline-none 
            focus:border-form-focus-border-color
            focus:dark:border-dark-form-focus-border-color
            focus:outline-none
            hover:border-form-element-hover
            dark:hover:border-dark-form-element-hover"
            name={props.name}
            tabIndex={props.tabIndex}
            >
            {props.children}
        </select>
    );
});

export default CardSelect;