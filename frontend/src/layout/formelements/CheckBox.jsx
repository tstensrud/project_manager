import React, { forwardRef } from 'react';

const CheckBox = forwardRef((props, ref) => {
    return (
        <input
        className="outline-none bg-[white] border border-form-border-color w-4 m-0 focus:shadow-[black]"
        ref={ref}
        type="checkbox"
        onChange={props.changeFunction}
        name={props.name}
        tabIndex={props.tabIndex}
        disabled={props.disabled} />
    );
});

export default CheckBox;