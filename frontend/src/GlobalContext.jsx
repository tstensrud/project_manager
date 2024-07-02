import React, { createContext, useState } from 'react';

const GlobalContext = createContext();

const GlobalProvider = ({ children }) => {
    const [activeProject, setActiveProject] = useState(null);
    const [userUuid, setUserUuid] = useState(null);
    const [userName, setUserName] = useState(null);
    const [activeProjectName, setActiveProjectName] = useState(null);
    const [token, setToken] = useState(null);

    return (
        <GlobalContext.Provider value={{ activeProject, setActiveProject, userUuid, setUserUuid, userName, setUserName, activeProjectName, setActiveProjectName, token, setToken }}>
            {children}
        </GlobalContext.Provider>
    );
};

export { GlobalContext, GlobalProvider };