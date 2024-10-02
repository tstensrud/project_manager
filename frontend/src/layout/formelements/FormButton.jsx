function FormButton(props) {

    return (
        <>
            {
                props.clickFunction ? (
                    <button
                        onClick={props.clickFunction}
                        type="submit"
                        className="
                        outline-0
                        uppercase
                        bg-form-background-color
                        dark:bg-dark-form-background-color 
                        border 
                        border-form-border-color 
                        dark:border-dark-form-border-color
                        pl-5 pr-5 
                        text-primary-color
                        dark:text-dark-primary-color
                        transition
                        ease-in-out
                        duration-200
                        cursor-pointer
                        rounded-lg
                        h-9
                        hover:border-form-element-hover
                        hover:dark:border-dark-form-element-hover
                        focus:border-form-focus-border-color
                        focus:dark:border-dark-form-focus-color
                        focus:outline-none"
                        disabled={props.disabled}
                        >
                        {props.buttonText}
                    </button>
                ) : (
                    <button
                        type="submit"
                        className="outline-0
                        uppercase
                        bg-form-background-color
                        dark:bg-dark-form-background-color 
                        border
                        border-form-border-color
                        dark:border-dark-form-border-color
                        pl-5
                        pr-5 
                        text-primary-color
                        dark:text-dark-primary-color
                        transition
                        ease-in-out
                        duration-200
                        cursor-pointer
                        rounded-lg
                        h-9
                        hover:border-form-element-hover
                        hover:dark:border-dark-form-element-hover
                        focus:border-form-focus-border-color
                        focus:dark:border-dark-form-focus-color
                        focus:outline-none"
                        disabled={props.disabled}
                        >
                        {props.buttonText}
                    </button>
                )
            }
        </>
    );
}

export default FormButton;