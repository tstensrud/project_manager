function AdminNavButton({buttonText, index, activeIndex, setActiveIndex}) {

    const handleClick = (e) => {
        e.preventDefault();
        setActiveIndex(index);
    }
    return (
        <button onClick={handleClick} className={
            index === activeIndex ? "border rounded-lg pl-3 pr-3 pt-1 pb-1 border-accent-color dark:border-dark-accent-color" :
             'border border-form-border-color dark:border-dark-default-border-color rounded-lg pl-3 pr-3 pt-1 pb-1 hover:border-primary-color dark:hover:border-dark-accent-color'}
        >
            {buttonText}
        </button>
    );
}

export default AdminNavButton;