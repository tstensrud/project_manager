function ContentCard(props) {
    return (
        <div className="max-w-[1000px] min-w-[400px] bg-secondary-color rounded-lg ml-5 mr-5 mt-5 shadow-lg shadow-background-shade">
            <div className="flex flex-col p-4 h-full">
            {props.children}
            </div>
        </div>
        
    );
}

export default ContentCard;