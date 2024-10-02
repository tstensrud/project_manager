import EditIcon from '../../assets/svg/editIcon.jsx'

function EditableTableCell({children}) {
    return (
        <div className="group flex flex-row w-full h-full">
        <div className="flex w-[10%]">

        </div>
        <div className="flex flex-1 justify-center items-center">
            {children}
        </div>
        <div className="flex w-[10%] justify-end items-start pr-1 pt-1">
            <div className="hidden group-hover:block">
                <EditIcon width={11} height={11} primary={true} />
            </div>
        </div>
    </div>
    );
}

export default EditableTableCell;