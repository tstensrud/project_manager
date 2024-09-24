function AdminNavButton({buttonText, index, activeIndex, setActiveIndex}) {

    const handleClick = (e) => {
        e.preventDefault();
        setActiveIndex(index);
    }
    return (
        <button onClick={handleClick} className={
            index === activeIndex ? "border-2 rounded-3xl pl-3 pr-3 pt-1 pb-1 border-accent-color dark:border-dark-accent-color" :
             'border-2 border-form-border-color dark:border-dark-form-border-color rounded-3xl pl-3 pr-3 pt-1 pb-1 hover:border-form-element-hover dark:hover:border-dark-accent-color'}
        >
            {buttonText}
        </button>
    );
}

export default AdminNavButton;