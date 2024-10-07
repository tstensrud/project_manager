function SummaryHeader(props) {
    return (
        <div className="flex w-full cursor-pointer pt-1 pb-1 text-grey-text dark:text-dark-grey-text rounded-lg">
            <div className="flex justify-start w-full font-semibold">
                {props.header}
            </div>
        </div>
    );
}

export default SummaryHeader;