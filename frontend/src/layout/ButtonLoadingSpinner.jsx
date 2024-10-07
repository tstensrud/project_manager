function ButtonLoadingSpinner({width}) {
    return (
        <button
            type="submit"
            style={{width: `${width}px`}}
            className={`flex justify-center items-center text-center bg-tertiary-color dark:bg-dark-tertiary-color dark:border-dark-default-border-color border-form-border-color uppercase outline-none border text-primary-color dark:text-dark-primary-color text-xs cursor-pointer rounded-lg h-9 pl-5 pr-5`}
            disabled>
            <div className="border-4 border-tertiary-color dark:border-dark-tertiary-color rounded-full border-t-accent-color dark:border-t-dark-accent-color w-5 h-5 animate-spin mr-1"></div>
        </button>
    );
}

export default ButtonLoadingSpinner;