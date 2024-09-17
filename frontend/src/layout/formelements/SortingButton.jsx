function SortingButton({name, index, sortButtonClick, buttonText, disabled}) {
    
    const handleClick = () => {
        sortButtonClick(index);
    }
    return (
        <button
        name={name}
        onClick={handleClick}
        className="
        uppercase
        h-11
        outline-none
        bg-secondary-color
        dark:bg-dark-secondary-color
        rounded-3xl
        border-2
        border-form-border-color
        dark:border-dark-form-border-color
        pr-5
        pl-5 
        r-5
        text-primary-color
        dark:text-dark-primary-color
        text-sm font-bold
        transition
        duration-200
        cursor-pointer
        mr-2
        hover:border-form-focus-border-color
        hover:dark:border-dark-form-focus-border-color"
        disabled={disabled || false}
        >
            {buttonText}
        </button>
    );
}

export default SortingButton;
