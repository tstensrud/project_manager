import { useEffect, useState } from "react";

function MessageBox({ message, closeable, error, setServerSuccesFalseMsg }) {
    const [errorPopUpClass, setErrorPopUpClass] = useState('popup-hide');

    useEffect(() => {
        setErrorPopUpClass("absolute block cursor-pointer fixed top-1/4 left-1/2 text-base -translate-x-1/2 -translate-y-1/5 bg-tertiary-color dark:bg-dark-tertiary-color text-primary-color rounded-lg dark:text-dark-primary-color border border-accent-color dark:border-dark-accent-color p-5 shadow shadow-background-shade z-[1000] w-[500px] break-words")
    }, [message]);

    const closeMessagePopUp = () => {
        //setErrorPopUpClass('hidden');
        setServerSuccesFalseMsg(null);
    }

    return (
        <>
            {
                closeable ? (
                    <div className={`absolute block cursor-pointer top-1/4 left-1/2 text-base -translate-x-1/2 -translate-y-1/5 bg-tertiary-color dark:bg-dark-tertiary-color hover:bg-secondary-color hover:dark:bg-dark-secondary-color text-primary-color rounded-lg dark:text-dark-primary-color border border-extract-color p-5 shadow shadow-background-shade z-[1000] w-[500px] break-words`} onClick={closeMessagePopUp}>
                        <div className="flex flex-row w-full">
                            <div className="">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="stroke-extract-color dark:stroke-extract-color fill-none">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <line x1="12" y1="8" x2="12" y2="12"></line>
                                    <line x1="12" y1="16" x2="12" y2="16"></line>
                                </svg>
                            </div>
                            <div className="flex flex-1 pl-5">
                                {message}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-row w-full h-full items-center justify-center text-center">
                        <div className={`flex border p-5 rounded-lg border-accent-color ${error && 'border-extract-color dark:text-[#EE9090]'} items-center`}>
                            <div className="">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`${error ? 'stroke-extract-color' : 'stroke-accent-color dark:stroke-dark-accent-color'}  fill-none`}>
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <line x1="12" y1="8" x2="12" y2="12"></line>
                                    <line x1="12" y1="16" x2="12" y2="16"></line>
                                </svg>
                            </div>
                            <div className="pl-5">
                                {message}
                            </div>
                        </div>
                    </div>
                )
            }

        </>
    );
}

export default MessageBox;