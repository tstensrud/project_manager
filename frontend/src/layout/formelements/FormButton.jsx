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
                        bg-secondary-color
                        dark:bg-dark-secondary-color 
                        border 
                        border-form-border-color 
                        dark:border-dark-default-border-color
                        pl-5 pr-5 
                        text-primary-color
                        dark:text-dark-primary-color
                        transition
                        ease-in-out
                        duration-200
                        cursor-pointer
                        rounded-lg
                        text-sm
                        h-9
                        hover:border-primary-color
                        hover:dark:border-dark-accent-color
                        focus:border-primary-color
                        focus:dark:border-dark-accent-color
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
                        bg-secondary-color
                        dark:bg-dark-secondary-color 
                        border
                        border-form-border-color
                        dark:border-dark-default-border-color
                        text-sm
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
                        hover:border-primary-color
                        hover:dark:border-dark-accent-color
                        focus:border-primary-color
                        focus:dark:border-dark-accent-color
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