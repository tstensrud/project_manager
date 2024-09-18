function TableButton(props) {
    return (
        <button
        onClick={props.clickFunction}
        disabled={props.disabled}
        className="text-primary-color dark:text-dark-primary-color w-fit uppercase h-5 outline-none border-2 border-form-border-color dark:border-dark-form-border-color bg-form-background-color dark:bg-dark-form-background-color text-xs cursor-pointer transition duration-200 rounded-3xl pl-4 pr-4 
        hover:border-form-element-hover hover:dark:border-dark-form-element-hover hover:bg-tertiary-color hover:dark:bg-dark-tertiary-color">
            {props.buttonText}
        </button>
    );
}

export default TableButton;