import { useState } from 'react';
import HelpBox from '../layout/HelpBox.jsx'

function TableTop({ title, sections, collapseAll, setCollapseAll }) {
    const [showHelpBox, setShowHelpBox] = useState(false);

    const toggleHelpBox = (e) => {
        e.preventDefault();
        setShowHelpBox(!showHelpBox);
    }
    const handleCollapseAll = () => {
        setCollapseAll(!collapseAll)
    }

    return (
        <>
            {
                showHelpBox && (
                    <HelpBox title={title} sections={sections} setShowHelpBox={toggleHelpBox} />
                )
            }
            <div className="flex flex-row w-full">
                <div className="flex bg-secondary-color dark:bg-dark-secondary-color sticky mt-5 p-3 rounded-tl-lg">
                    <svg onClick={toggleHelpBox} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="cursor-pointer stroke-accent-color dark:stroke-dark-accent-color fill-none hover:stroke-primary-color hover:dark:stroke-dark-primary-color transition duration-300">
                        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="17" x2="12" y2="17"></line>
                    </svg>
                </div>
                <div className="group flex flex-1 justify-end bg-secondary-color dark:bg-dark-secondary-color sticky mt-5 rounded-tr-lg">
                    {
                        setCollapseAll && (
                            <div className="cursor-pointer flex flex-row h-full" onClick={handleCollapseAll}>
                                <div className="h-full flex items-center text-center pr-3 text-lg font-semibold tracking-wide tansition duration-300 text-grey-text dark:text-dark-grey-text hover:text-primary-color dark:hover:text-dark-primary-color">
                                    {
                                        collapseAll ? "Utvid alle" : "Kollaps alle"
                                    }
                                </div>
                                <div className={collapseAll ? "pt-3 pl-3 rotate-180 " : `pt-3 pr-3`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="stroke-accent-color dark:stroke-dark-accent-color fill-none cursor-pointer group-hover:stroke-primary-color group-hover:dark:stroke-dark-primary-color tansition duration-300">
                                        <polyline points="18 15 12 9 6 15"></polyline>
                                    </svg>
                                </div>
                            </div>
                        )
                    }


                </div>
            </div>
        </>
    );
}

export default TableTop;