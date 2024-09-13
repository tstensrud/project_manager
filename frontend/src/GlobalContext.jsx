import React, { createContext, useEffect, useState } from 'react';

const GlobalContext = createContext();

const GlobalProvider = ({ children }) => {
    const [activeProject, setActiveProject] = useState(null);
    const [userUuid, setUserUuid] = useState(null);
    const [userName, setUserName] = useState(null);
    const [activeProjectName, setActiveProjectName] = useState(null);
    const [token, setToken] = useState(null);
    const [darkMode, setDarkMode] = useState(true);

    const value = {
        activeProject,
        setActiveProject,
        userUuid,
        setUserUuid,
        userName,
        setUserName,
        activeProjectName,
        setActiveProjectName,
        token,
        setToken,
        darkMode,
        setDarkMode
    };

    useEffect(() => {
        const theme = localStorage.getItem("theme");
        if (theme === "light") {
            setDarkMode(false);
        } else {
            setDarkMode(true);
        }
    }, []);

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    }, [darkMode]);
    
    return (
        <GlobalContext.Provider value={value}>
            {children}
        </GlobalContext.Provider>
    );
};

export { GlobalContext, GlobalProvider };