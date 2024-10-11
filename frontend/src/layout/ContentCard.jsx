function ContentCard({ children, width }) {
    return (
        <>
            {
                width ? (
                    <div style={{ width: `${width}px` }} className={`bg-secondary-color dark:bg-dark-tertiary-color rounded-lg mt-5`}>
                        <div className="flex flex-col p-4 h-full w-full">
                            {children}
                        </div>
                    </div>
                ) : (
                    <div className={`bg-secondary-color dark:bg-dark-tertiary-color rounded-lg mt-5 w-full md:w-1/2`}>
                        <div className="flex flex-col p-4 h-full w-full">
                            {children}
                        </div>
                    </div>
                )
            }
        </>
    );
}

export default ContentCard;