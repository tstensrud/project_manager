function CardButton(props) {

    return (
        <>
            {
                props.clickFunction ? (
                    <button
                        type="submit"
                        onClick={props.clickFunction}
                        className="
                            bg-tertiary-color border-form-border-color border-2 uppercase outline-none text-primary-color font-semibold text-xs transition duration-200 cursor-pointer rounded-3xl h-9 pl-5 pr-5
                            hover:border-form-element-hover 
                            focus:border-form-element-hover"
                        tabIndex={props.tabIndex}
                    >
                        {props.buttonText}
                    </button>
                ) : (
                    <button
                        type="submit"
                        className="
                            bg-tertiary-color border-form-border-color border-2 uppercase outline-none text-primary-color font-semibold text-xs transition duration-200 cursor-pointer rounded-3xl h-9 pl-5 pr-5
                            hover:border-form-element-hover 
                            focus:border-form-element-hover"
                        tabIndex={props.tabIndex}
                    >
                        {props.buttonText}
                    </button>
                )
            }
        </>
    );
}

export default CardButton;