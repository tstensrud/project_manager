function SummaryHeader(props) {
    return (
        <div className="flex w-full cursor-pointer p-1 text-grey-text rounded-lg mt-1">
            <div className="flex justify-start w-full font-semibold">
                {props.header}
            </div>
        </div>
    );
}

export default SummaryHeader;