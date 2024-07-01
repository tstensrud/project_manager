import React, { createContext, useState } from 'react';

const GlobalContext = createContext();

const GlobalProvider = ({ children }) => {
    const [activeProject, setActiveProject] = useState(null);
    const [activeProjectName, setActiveProjectName] = useState(null);
    const [token, setToken] = useState(null);

    return (
        <GlobalContext.Provider value={{ activeProject, setActiveProject, activeProjectName, setActiveProjectName, token, setToken }}>
            {children}
        </GlobalContext.Provider>
    );
};

export { GlobalContext, GlobalProvider };