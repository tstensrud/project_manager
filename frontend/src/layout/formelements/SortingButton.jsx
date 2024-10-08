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
        rounded-lg
        border
        border-form-border-color
        dark:border-dark-default-border-color
        pr-5
        pl-5 
        r-5
        text-primary-color
        dark:text-dark-primary-color
        text-sm
        transition
        duration-200
        cursor-pointer
        mr-2
        hover:border-primary-color
        hover:dark:border-dark-accent-color"
        disabled={disabled || false}
        >
            {buttonText}
        </button>
    );
}

export default SortingButton;
