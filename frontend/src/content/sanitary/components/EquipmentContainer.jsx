function EquipmentContainer(props) {
    return (
        <div className="flex w-full cursor-pointer pt-1 pb-1 rounded-lg hover:bg-table-hover hover:dark:bg-dark-table-hover text-sm">
            <div className="flex justify-start w-[70%]">
                {props.type}
            </div>
            <div className="flex justify-end w-[30%]">
                {props.children}
            </div>
        </div>
    );
}

export default EquipmentContainer;