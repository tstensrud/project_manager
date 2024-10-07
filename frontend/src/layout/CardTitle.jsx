function CardTitle(props) {
    return (
        <>
            <div className="flex w-full">
                <div className="flex items-center justify-center text-center">
                    <div className="dark:bg-dark-accent-color bg-accent-color p-1 border border-accent-color dark:border-dark-accent-color rounded-lg">
                        {props.svg}
                    </div>
                </div>
                <div className="flex items-center justify-center text-center pl-3 text-2xl">
                    {props.title}
                </div>
            </div>
        </>
    );
}
export default CardTitle;