function CardTitle(props) {
    return (
        <>
            <div className="flex w-full">
                <div className="flex align-center text-center mr-10">
                    {props.svg}
                </div>
                <div className="flex align-center text-center text-card-title">
                    {props.title}
                </div>
            </div>
        </>
    );
}
export default CardTitle;