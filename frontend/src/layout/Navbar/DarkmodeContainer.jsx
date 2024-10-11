import { useContext } from "react";
import { GlobalContext } from '../../context/GlobalContext';

function DarkmodeContainer() {
    const { darkMode, setDarkMode } = useContext(GlobalContext);


    // Handlers
    const toggleDarkModeContainer = () => {
        setDarkMode(!darkMode);
    }

    return (
        <div onClick={toggleDarkModeContainer} className="cursor-pointer flex items-center justify-center">
            <div className="group cursor-pointer group border hover:bg-accent-color hover:border-accent-color hover:dark:bg-dark-navbar-active-bg-color dark:border-dark-accent-color rounded-lg transition duration-200 p-2">
            {
                darkMode ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 26" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="stroke-primary-color group-hover:stroke-secondary-color group-hover:dark:stroke-dark-primary-color dark:stroke-dark-grey-text fill-none transition duration-200">
                        <circle cx="12" cy="12" r="5"></circle>
                        <line x1="12" y1="1" x2="12" y2="3"></line>
                        <line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line>
                        <line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                    </svg>
                ) : (
                    <svg className="stroke-primary-color group-hover:stroke-secondary-color group-hover:dark:stroke-dark-primary-color dark:stroke-dark-grey-text fill-none transition duration-200" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" width="20" height="20" viewBox="0 0 24 24">
                        <defs></defs>
                        <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"></path>
                    </svg>
                )
            }
            </div>
        </div>
    );
}

export default DarkmodeContainer;