import React, { createContext, useState } from 'react';

const GlobalContext = createContext();

const GlobalProvider = ({ children }) => {
    const [activeProject, setActiveProject] = useState(null);
    const [token, setToken] = useState(null);

    return (
        <GlobalContext.Provider value={{ activeProject, setActiveProject, token, setToken }}>
            {children}
        </GlobalContext.Provider>
    );
};

export { GlobalContext, GlobalProvider };