function SearchInput(props) {
    return (
        <div className="flex flex-row flex-1">
            <input
                className="
        bg-secondary-color
        dark:bg-dark-secondary-color
        border-form-border-color
        dark:border-dark-default-border-color
        text-primary-color
        dark:text-dark-primary-color
        outline-none
        w-full
        border
        pl-5
        pr-5
        text-sm
        rounded-lg
        h-9
        focus:border-primary-color
        focus:dark:border-dark-accent-color
        hover:border-primary-color
        hover:dark:border-dark-accent-color"
                onChange={props.changeFunction}
                type="text"
                value={props.value}
                placeholder={props.placeholder}
            />
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="stroke-grey-text fill-none relative right-10 top-2">
                <circle cx="10.5" cy="10.5" r="7.5"></circle>
                <line x1="21" y1="21" x2="15.8" y2="15.8"></line>
            </svg>
        </div>
    );
}

export default SearchInput;