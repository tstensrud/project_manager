import { useContext, useState } from "react";
import { Outlet } from 'react-router-dom';
import { GlobalContext } from './GlobalContext';
import Header from './layout/Header';



function Layout() {
    const { userUuid, setUserUuid } = useContext(GlobalContext);

    return (
        <>
            <Header/>
            <div className="flex flex-col h-full bg-secondary-color text-primary-color">
                <Outlet />
            </div>
        </>
    );
}

export default Layout;