function ContentCard(props) {
    return (
        <div className="
                    max-w-[1000px]
                    min-w-[400px]
                    bg-secondary-color
                    dark:bg-dark-secondary-color
                    rounded-lg
                    ml-5
                    mr-5
                    mt-5
                    shadow-lg
                    shadow-background-shade
                    transition
                    duration-100
                    border
                    dark:border-dark-default-border-color
                    border-table-border-color
        ">
            <div className="flex flex-col p-4 h-full">
                {props.children}
            </div>
        </div>

    );
}

export default ContentCard;