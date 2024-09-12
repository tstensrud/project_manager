function EditableInputField(props) {
    return (
        <input
            type="text"
            className="bg-form-background-color text-primary-color text-xs rounded-none w-full h-full m-0 border-primary-color border-t-0 border-b-0 pl-2 top-0 left-0 focus:outline-none focus:bg-tertiary-color"
            value={props.value}
            onChange={props.changeFunction}
            onBlur={props.blur}
            onKeyDown={props.keyDown}
            autoFocus
        />
    );
}

export default EditableInputField;