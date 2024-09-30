import { useContext, useState } from "react";
import { Outlet } from 'react-router-dom';
import { GlobalContext } from './context/GlobalContext';
import Header from './layout/Header';



function Layout() {
    const { userUuid, setUserUuid } = useContext(GlobalContext);

    return (
        <>
            <Header/>
            
                <Outlet />
            
        </>
    );
}

export default Layout;