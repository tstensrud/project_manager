import { useEffect, useState } from "react";

function MessageBox({ message }) {
    const [errorPopUpClass, setErrorPopUpClass] = useState('popup-hide');

    useEffect(() => {
        setErrorPopUpClass("block fixed top-1/4 left-1/2 text-base -translate-x-1/2 -translate-y-1/5 bg-tertiary-color dark:bg-dark-tertiary-color text-primary-color dark:text-dark-primary-color border border-form-border-color dark:border-dark-form-border-color p-5 shadow shadow-background-shade z-[1000] w-[500px] break-words")
    }, [message]);

    const closeMessagePopUp = () => {
        setErrorPopUpClass('hidden');
    }

    return (

        <div className={errorPopUpClass}>
            <div className="hidden"></div>
                <span className="absolute top-4 right-4 text-primary-color dark:text-dark-r font-bold cursor-pointer hover:text-accent-color dark:text-dark-primary-color hover:dark:text-dark-accent-color" onClick={closeMessagePopUp}>×</span>
            <p>{message}</p>
        </div>
    );
}

export default MessageBox;