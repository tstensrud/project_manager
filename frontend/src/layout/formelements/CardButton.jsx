import { useEffect, useRef, useState } from "react";
import ButtonLoadingSpinner from "../ButtonLoadingSpinner";

function CardButton({ clickFunction, tabIndex, disabled, buttonText, loading }) {
    const buttonRef = useRef(null);
    const [buttonWidth, setButtonWidth] = useState(0)

    useEffect(() => {
        setButtonWidth(buttonRef.current.offsetWidth);
    }, [])

    return (

        <>
            {
                loading ? (
                    <ButtonLoadingSpinner width={buttonWidth} />
                ) : (
                    <>
                        {
                            clickFunction ? (
                                <button
                                    ref={buttonRef}
                                    type="submit"
                                    id="cardButton"
                                    onClick={clickFunction}
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
                                    tabIndex={tabIndex}
                                    disabled={disabled}
                                >
                                    {buttonText}
                                </button>
                            ) : (
                                <button
                                    ref={buttonRef}
                                    type="submit"
                                    id="cardButton"
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
                                    tabIndex={tabIndex}
                                    disabled={disabled}
                                >
                                    {buttonText}
                                </button>
                            )
                        }
                    </>
                )
            }

        </>
    );
}

export default CardButton;