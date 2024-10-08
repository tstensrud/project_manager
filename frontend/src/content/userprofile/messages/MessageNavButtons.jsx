function MessageNavButtons({buttonText, index, activeIndex, setActiveIndex}) {

    const handleClick = (e) => {
        e.preventDefault();
        setActiveIndex(index);
    }
    return (
        <button onClick={handleClick} className={
            index === activeIndex ? "border text-sm rounded-lg pl-3 pr-3 pt-1 pb-1 border-accent-color bg-accent-color text-secondary-color dark:border-dark-accent-color dark:bg-dark-tertiary-color" :
             'border border-form-border-color text-sm dark:border-dark-default-border-color rounded-lg pl-3 pr-3 pt-1 pb-1 hover:border-primary-color dark:hover:border-dark-accent-color'}
        >
            {buttonText}
        </button>
    );
}

export default MessageNavButtons;