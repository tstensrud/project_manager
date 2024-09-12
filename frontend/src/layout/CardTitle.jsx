function CardTitle(props) {
    return (
        <>
            <div className="flex w-full">
                <div className="flex items-center text-center mr-3">
                    {props.svg}
                </div>
                <div className="flex items-center text-center text-2xl">
                    {props.title}
                </div>
            </div>
        </>
    );
}
export default CardTitle;