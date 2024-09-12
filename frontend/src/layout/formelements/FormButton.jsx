function FormButton(props) {


    return (
        <>
            {
                props.clickFunction ? (
                    <button
                        onClick={props.clickFunction}
                        type="submit"
                        className="outline-0 uppercase bg-form-background-color border-2 border-form-border-color pl-5 pr-5 text-primary-color transition ease-in-out duration-200 cursor-pointer rounded-3xl h-9 hover:border-form-element-hover focus:border-form-element-hover">
                        {props.buttonText}
                    </button>
                ) : (
                    <button
                        type="submit"
                        className="outline-0 uppercase bg-form-background-color border-2 border-form-border-color pl-5 pr-5 text-primary-color transition ease-in-out duration-200 cursor-pointer rounded-3xl h-9 hover:border-form-element-hover focus:border-form-element-hover">
                        {props.buttonText}
                    </button>
                )
            }

        </>
    );
}

export default FormButton;