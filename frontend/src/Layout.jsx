import { useContext, useState } from "react";
import { Outlet } from 'react-router-dom';

import { AuthContext } from './context/AuthContext.jsx';
import Navbar from './layout/Navbar/Navbar';



function Layout({ children }) {
    const { currentUser, idToken } = useContext(AuthContext);

    return (
        <>
            <Navbar></Navbar>
            <Outlet>
                {children}
            </Outlet>
        </>
    );
}

export default Layout;