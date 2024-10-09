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
            <div className="flex flex-row w-full bg-secondary-color dark:bg-dark-tertiary-color rounded-lg pt-2 pb-2">
                <div className="flex items-center pl-3">
                    <div onClick={toggleHelpBox} className="group relative cursor-pointer group p-1 border hover:bg-accent-color hover:border-accent-color hover:dark:bg-dark-navbar-active-bg-color dark:border-dark-accent-color rounded-lg transition duration-300">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="stroke-primary-color group-hover:stroke-secondary-color group-hover:dark:stroke-dark-primary-color dark:stroke-dark-grey-text fill-none transition duration-300">
                            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                            <line x1="12" y1="17" x2="12" y2="17"></line>
                        </svg>
                    </div>
                </div>
                <div className="flex flex-1 justify-end items-center">
                    {
                        setCollapseAll && (
                            <div className="cursor-pointer flex items-center flex-row h-full pr-3" onClick={handleCollapseAll}>
                                <div className={`group flex p-1 h-full items-center justify-center border hover:bg-accent-color hover:border-accent-color hover:dark:bg-dark-navbar-active-bg-color rounded-lg dark:border-dark-accent-color border-primary-color transition duration-300 ${collapseAll && "rotate-180"}`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="stroke-accent-color dark:stroke-dark-grey-text fill-none cursor-pointer group-hover:stroke-secondary-color group-hover:dark:stroke-dark-primary-color tansition duration-300">
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