function SortingButton({name, sortButtonClick, buttonText}) {
    return (
        <button
            name={name}
            onClick={sortButtonClick}
            className="uppercase h-11 outline-none bg-secondary-color rounded-3xl border-2 border-form-focus-color pl-5 pr-5 text-primary-color text-sm font-bold transition duration-200 cursor-pointer mr-2"
        >
            {buttonText}
        </button>
    );
}

export default SortingButton;
