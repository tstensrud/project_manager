import { useEffect, useState } from "react";

function MessageBox({ message }) {
    const [errorPopUpClass, setErrorPopUpClass] = useState('popup-hide');

    useEffect(() => {
        setErrorPopUpClass("block fixed top-1/4 left-1/2 text-base -translate-x-1/2 -translate-y-1/5 bg-tertiary-color dark:bg-dark-tertiary-color text-primary-color dark:text-dark-primary-color border border-accent-color dark:border-dark-accent-color p-5 shadow shadow-background-shade z-[1000] w-[500px] break-words")
    }, [message]);

    const closeMessagePopUp = () => {
        setErrorPopUpClass('hidden');
    }

    return (

        <div className={errorPopUpClass}>
            <div className="flex flex-col w-full">
                <div className="flex justify-end">
                    <div className="absolute top-4 right-4 text-primary-color dark:text-dark-r text-2xl font-bold cursor-pointer hover:text-accent-color dark:text-dark-primary-color hover:dark:text-dark-accent-color" onClick={closeMessagePopUp}>
                        &times;
                    </div>
                </div>
                <div className="">
                    {message}
                </div>
            </div>
        </div>
    );
}

export default MessageBox;