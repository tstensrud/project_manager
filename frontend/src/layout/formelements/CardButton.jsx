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
                            dark:bg-dark-secondary-color
                            border-form-border-color
                            dark:border-dark-default-border-color
                            border
                            uppercase outline-none
                            text-primary-color
                            dark:text-dark-primary-color
                            text-xs cursor-pointer rounded-lg
                            h-9
                            pl-5
                            pr-5
                            hover:border-primary-color
                            hover:dark:border-dark-accent-color
                            focus:border-primary-color
                            focus:dark:border-dark-accent-color
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
                            dark:bg-dark-secondary-color
                            dark:border-dark-default-border-color
                            border-form-border-color
                            uppercase outline-none 
                            border
                            text-primary-color
                            dark:text-dark-primary-color
                            text-xs cursor-pointer rounded-lg
                            h-9
                            pl-5
                            pr-5
                            hover:border-primary-color
                            hover:dark:border-dark-accent-color
                            focus:border-primary-color
                            focus:dark:border-dark-accent-color"
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