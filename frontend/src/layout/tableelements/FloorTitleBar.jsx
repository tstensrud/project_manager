function FloorTitleBar({ floor, showTable, setShowTable }) {

    const handleOnCollapseClick = () => {
        setShowTable(!showTable);
    }

    return (
        <div onClick={handleOnCollapseClick} className="group cursor-pointer text-grey-text flex-row dark:text-dark-grey-text text-xs border-none w-full h-10 max-w-full pt-1 pb-1 bg-secondary-color dark:bg-dark-secondary-color flex justify-center shadow-lg shadow-background-shade hover:text-primary-color hover:dark:text-dark-primary-color tansition duration-300">
            <div className="flex w-full flex-row justify-center items-center">
                <div className={showTable ? "pr-3" : "pl-3 rotate-180"}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="stroke-accent-color dark:stroke-dark-accent-color fill-none cursor-pointer group-hover:stroke-primary-color group-hover:dark:stroke-dark-primary-color tansition duration-300">
                        <polyline points="18 15 12 9 6 15"></polyline>
                    </svg>
                </div>
                <h3>Etasje {floor}</h3>
            </div>
        </div>
    );
}

export default FloorTitleBar;