function RoomDatarowTitle(props) {
    return (
        <div className="flex w-full pt-1 pb-1 pl-5 border-b border-default-border-color dark:border-dark-default-border-color bg-secondary-color dark:bg-dark-tertiary-color">
        <div className="flex w-1/2">
          <div className="text-lg font-semibold w-full">
            {props.title}
          </div>
        </div>
      </div>
    );
}

export default RoomDatarowTitle;