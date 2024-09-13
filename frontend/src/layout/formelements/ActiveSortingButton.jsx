function ActiveSortingButton({name, sortButtonClick, buttonText}) {
    return (
        <button
            name={name}
            onClick={sortButtonClick}
            className="
            uppercase h-11
            outline-none
            bg-secondary-color
            dark:bg-dark-secondary-color
            rounded-3xl border-2
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
        >
            {buttonText}
        </button>
    );
}

export default ActiveSortingButton;