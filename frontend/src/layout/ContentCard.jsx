function ContentCard(props) {
    return (
        <div className="
                    max-w-[1000px]
                    min-w-[400px]
                    bg-secondary-color
                    dark:bg-dark-tertiary-color
                    rounded-lg
                    mt-5
        ">
            <div className="flex flex-col p-4 h-full">
                {props.children}
            </div>
        </div>

    );
}

export default ContentCard;