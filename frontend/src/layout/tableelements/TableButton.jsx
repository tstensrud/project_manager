function TableButton(props) {
    return (
        <button
        onClick={props.clickFunction}
        disabled={props.disabled}
        className="text-primary-color w-fit uppercase h-5 outline-none border-2 border-form-border-color bg-form-background-color text-xs cursor-pointer transition duration-200 rounded-3xl pl-4 pr-4 hover:border-form-element-hover hover:bg-tertiary-color">
            {props.buttonText}
        </button>
    );
}

export default TableButton;