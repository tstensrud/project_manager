function TableButton(props) {
    return (
        <button
        onClick={props.clickFunction}
        disabled={props.disabled}
        className="text-primary-color
        dark:text-dark-primary-color
        w-fit
        uppercase
        h-6
        outline-none
        border
        border-form-border-color
        dark:border-dark-default-border-color
        bg-secondary-color
        dark:bg-dark-secondary-color
        text-sm
        cursor-pointer
        transition
        duration-200
        rounded-lg
        pl-4
        pr-4 
        hover:border-primary-color
        hover:dark:border-dark-accent-color
        hover:bg-tertiary-color
        hover:dark:bg-dark-tertiary-color">
            {props.buttonText}
        </button>
    );
}

export default TableButton;