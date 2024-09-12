import React, { forwardRef } from 'react';

const CardSelect = forwardRef((props, ref) => {
    return (
        <select
            ref={ref}
            onChange={props.changeFunction}
            className="bg-tertiary-color border-2 border-form-border-color rounded-3xl text-sm pl-5 pr-5 h-9 transition duration-200 outline-none hover:border-form-element-hover focus:border-form-focus-border-color"
            name={props.name}
            tabIndex={props.tabIndex}
            >
            {props.children}
        </select>
    );
});

export default CardSelect;