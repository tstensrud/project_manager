import { useContext } from "react";
import { GlobalContext } from '../../GlobalContext';

function DarkmodeContainer() {
    const {darkMode, setDarkMode }= useContext(GlobalContext);


    // Handlers
    const toggleDarkModeContainer = () => {
        setDarkMode(!darkMode);
    }

    return (
        <>
            <div className="flex mr-3">
                <svg className="stroke-accent-color dark:stroke-dark-accent-color fill-none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" width="24" height="24" viewBox="0 0 24 24">
                    <defs></defs>
                    <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"></path>
                </svg>
            </div>
            <div className="relative w-10 h-5">
                <input onClick={toggleDarkModeContainer} onChange={null} type="checkbox" id="toggle" checked={darkMode ? false : true} />
                <label htmlFor="toggle" className="slider"></label>
            </div>
            <div className="flex ml-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 26" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="stroke-accent-color dark:stroke-dark-accent-color fill-none">
                    <circle cx="12" cy="12" r="5"></circle>
                    <line x1="12" y1="1" x2="12" y2="3"></line>
                    <line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line>
                    <line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                </svg>
            </div>
        </>
    );
}

export default DarkmodeContainer;