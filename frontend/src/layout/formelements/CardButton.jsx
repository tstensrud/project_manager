function CardButton(props) {

    return (
        <>
            {
                props.clickFunction ? (
                    <button
                        type="submit"
                        onClick={props.clickFunction}
                        className="
                            bg-tertiary-color
                            dark:bg-dark-tertiary-color
                            border-form-border-color
                            dark:border-dark-form-border-color
                            border
                            uppercase outline-none
                            text-primary-color
                            dark:text-dark-primary-color
                            text-xs cursor-pointer rounded-lg h-9 pl-5 pr-5
                            hover:border-form-element-hover
                            hover:dark:border-dark-form-element-hover
                            focus:border-form-element-hover
                            focus:dark:border-dark-form-focus-color
                            "
                        tabIndex={props.tabIndex}
                        disabled={props.disabled}
                    >
                        {props.buttonText}
                    </button>
                ) : (
                    <button
                        type="submit"
                        className="
                            bg-tertiary-color
                            dark:bg-dark-tertiary-color
                            dark:border-dark-form-border-color
                            border-form-border-color
                            uppercase outline-none 
                            border
                            text-primary-color
                            dark:text-dark-primary-color
                            text-xs cursor-pointer rounded-lg h-9 pl-5 pr-5
                            hover:border-form-element-hover
                            hover:dark:border-dark-form-element-hover 
                            focus:border-form-element-hover
                            focus:dark:border-dark-form-focus-color"
                        tabIndex={props.tabIndex}
                        disabled={props.disabled}
                    >
                        {props.buttonText}
                    </button>
                )
            }
        </>
    );
}

export default CardButton;