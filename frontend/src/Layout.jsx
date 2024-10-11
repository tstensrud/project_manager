import { useState } from "react";
import { Outlet } from 'react-router-dom';

import Navbar from './layout/Navbar/Navbar';
import NavPanel from "./layout/NavPanel/NavPanel";

function Layout({ children }) {
    const [showMenu, setShowMenu] = useState(false);


    return (
        <div className="flex flex-row h-full w-full">
            <div className={`${showMenu ? 'animate-slideInFromLeft' : 'animate-slideOutToLeft'} bg-tertiary-color dark:bg-dark-secondary-color`}>
                <NavPanel showMenu={showMenu} setShowMenu={setShowMenu} />
            </div>
            <div className="flex flex-col h-full w-full">
                <Navbar />
                <Outlet>
                    {children}
                </Outlet>
            </div>
        </div>
    );
}

export default Layout;