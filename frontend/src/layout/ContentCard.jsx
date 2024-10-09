function ContentCard({children, width}) {
    return (
        <div style={{width: `${width}px`}} className={`bg-secondary-color dark:bg-dark-tertiary-color rounded-lg mt-5`}>
            <div className="flex flex-col p-4 h-full">
                {children}
            </div>
        </div>

    );
}

export default ContentCard;