function SearchInput(props) {
    return (
        <div className="flex flex-row flex-1">
            <input
                className="
        bg-form-background-color
        dark:bg-dark-form-background-color
        border-form-border-color
        dark:border-dark-form-border-color
        text-primary-color
        dark:text-dark-primary-color
        outline-none
        w-full
        border-2
        pl-5
        pr-5
        text-sm
        rounded-3xl
        h-9
        focus:border-form-focus-border-color
        focus:dark:border-dark-form-focus-border-color
        hover:border-form-element-hover
        hover:dark:border-dark-form-element-hover"
                onChange={props.changeFunction}
                type="text"
                value={props.value}
                placeholder="Skriv inn prosjektnavn"
            />
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="stroke-grey-text fill-none relative right-10 top-2">
                <circle cx="10.5" cy="10.5" r="7.5"></circle>
                <line x1="21" y1="21" x2="15.8" y2="15.8"></line>
            </svg>
        </div>
    );
}

export default SearchInput;