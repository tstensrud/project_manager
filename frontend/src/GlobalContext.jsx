import React, { createContext, useEffect, useState } from 'react';

const GlobalContext = createContext();

const GlobalProvider = ({ children }) => {
    const [activeProject, setActiveProject] = useState(null);
    const [userUuid, setUserUuid] = useState(null);
    const [userName, setUserName] = useState(null);
    const [activeProjectName, setActiveProjectName] = useState(null);
    const [token, setToken] = useState(null);
    const [darkmode, setDarkmode] = useState(true);

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
        darkmode,
        setDarkmode
    };

    useEffect(() => {
        const theme = localStorage.getItem("theme");
        if (theme === "light") {
            setDarkmode(false);
        } else {
            setDarkmode(true);
        }
    }, []);

    useEffect(() => {
        if (darkmode) {
            document.documentElement.classList.remove("light");
            localStorage.setItem("theme", "dark");
        } else {
            document.documentElement.classList.add("light");
            localStorage.setItem("theme", "light");
        }
    }, [darkmode]);
    
    return (
        <GlobalContext.Provider value={value}>
            {children}
        </GlobalContext.Provider>
    );
};

export { GlobalContext, GlobalProvider };