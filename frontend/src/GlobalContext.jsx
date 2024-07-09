import React, { createContext, useState } from 'react';
import useFetch from './hooks/useFetch'

const GlobalContext = createContext();

const GlobalProvider = ({ children }) => {
    const [activeProject, setActiveProject] = useState(null);
    const [userUuid, setUserUuid] = useState(null);
    const [userName, setUserName] = useState(null);
    const [activeProjectName, setActiveProjectName] = useState(null);
    const [token, setToken] = useState(null);

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
        setToken
    };

    return (
        <GlobalContext.Provider value={value}>
            {children}
        </GlobalContext.Provider>
    );
};

export { GlobalContext, GlobalProvider };