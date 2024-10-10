import React, { useEffect, useState } from 'react';

function CustomSelect({ selections, handleReceiverChange, userDataLoading }) {
    const [receiverName, setReceiverName] = useState("");
    const [receiverUid, setReceiverUid] = useState("")
    const [showUserList, setShowUserList] = useState(false);

    useEffect(() => {
        if (receiverUid) {
            handleReceiverChange(receiverUid);
        }
    }, [receiverUid]);

    const handleReceiverClick = (uuid, name) => {
        setShowUserList(false);
        setReceiverUid(uuid)
        setReceiverName(name);
    }

    return (
        <div className="group text-base flex flex-col rounded-lg bg-tertiary-color border-default-border-color dark:border-dark-default-border-color dark:bg-dark-secondary-color hover:dark:border-dark-accent-color relative hover:rounded-bl-none hover:rounded-br-none w-52">

            <div className="bg-tertiary-color dark:bg-dark-secondary-color p-1 rounded-lg items-center cursor-default flex flex-row">
                <div className="w-[10%]">

                </div>
                <div onMouseOver={() => setShowUserList(true)} className="flex flex-1 text-sm justify-center pl-2 pr-2">
                    {
                        userDataLoading ? (
                            "Laster brukere"
                        ) : (
                            <>
                                {
                                    receiverName !== "" ? (
                                        <>
                                            {receiverName}
                                        </>
                                    ) : (
                                        "Velg mottaker"
                                    )
                                }
                            </>
                        )
                    }
                </div>
                <div className="flex justify-end items-center w-[10%]">
                    <div className="rotate-180">
                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="stroke-primary-color dark:stroke-dark-primary-color fill-none cursor-pointer">
                            <polyline points="18 15 12 9 6 15"></polyline>
                        </svg>
                    </div>
                </div>
            </div>
            {
                !userDataLoading &&
                <>
                    {
                        showUserList && (
                            <div onMouseLeave={() => setShowUserList(false)} className="w-52 transition duration-200 text-sm bg-tertiary-color dark:bg-dark-secondary-color border-default-border-color dark:border-dark-default-border-color absolute z-50 top-full left-0 rounded-bl-lg rounded-br-lg rounded-tl-none rounded-tr-none cursor-pointer">
                                {
                                    selections && Object.keys(selections)
                                        .sort((a, b) => {
                                            const selectionA = selections[a].server.name;
                                            const selectionB = selections[b].server.name;

                                            return selectionA.localeCompare(selectionB)
                                        }
                                        )
                                        .map((key, index) => (
                                            <div onClick={() => (handleReceiverClick(selections[key].server.uuid, selections[key].server.name))} key={index} className="bg-tertiary-color text-grey-text dark:text-dark-grey-text dark:bg-dark-secondary-color hover:bg-primary-color hover:text-secondary-color hover:dark:text-dark-primary-color hover:dark:bg-dark-navbar-hover-bg-color pt-1 pb-1 pl-2 rounded-lg">
                                                {selections[key].server.name}
                                            </div>
                                        ))
                                }
                            </div>
                        )
                    }

                </>
            }

        </div>
    );
}

export default CustomSelect;