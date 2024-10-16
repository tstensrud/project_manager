function ActiveSortingButton({name, index, sortButtonClick, buttonText, disabled}) {
    const handleClick = () => {
        sortButtonClick(index);
    }

    return (
        <button
            name={name}
            onClick={handleClick}
            className="uppercase
            h-11
            outline-none 
            bg-secondary-color
            dark:bg-dark-secondary-color
            font-semibold
            rounded-lg
            border
            border-primary-color
            dark:border-dark-accent-color
            pl-5
            pr-5
            text-primary-color
            dark:text-dark-primary-color
            text-sm
            transition
            duration-200
            cursor-pointer
            mr-2"
            disabled={disabled || false}
        >
            {buttonText}
        </button>
    );
}

export default ActiveSortingButton;