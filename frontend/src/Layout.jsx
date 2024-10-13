import { useEffect, useRef, useState } from "react";
import { Outlet } from 'react-router-dom';

import Navbar from './layout/Navbar/Navbar';
import NavPanel from "./layout/NavPanel/NavPanel";

function Layout({ children }) {
    const [showMenu, setShowMenu] = useState(false);
    const [menuPinned, setMenuPinned] = useState(false);
    const [isMenuAnimationInProgress, setIsMenuAnimationInProgress] = useState(false);
    const menuRef = useRef(null);

    
    useEffect(() => {
        const handleWindowMouseLeave = (e) => {
            if (!e.relatedTarget && (e.clientY <= 0 || e.clientX <= 0 ||  e.clientX >= window.innerWidth || e.clientY >= window.innerHeight)) {
                if (!menuPinned) {
                    setIsMenuAnimationInProgress(false);
                    setShowMenu(false);
                }
            }
        }

        window.addEventListener('mouseout', handleWindowMouseLeave);
        return () => {
            window.removeEventListener('mouseout', handleWindowMouseLeave);
        }
        
    },[showMenu, menuPinned])

    // Handlers
    const handleMouseOverMenu = () => {
        if (!menuPinned && !showMenu && !isMenuAnimationInProgress) {
            setIsMenuAnimationInProgress(true);
            setShowMenu(true);
        }
    }

    const handleMouseOut = (e) => {
        if (!menuPinned && showMenu && !isMenuAnimationInProgress) {
            if (menuRef.current && !menuRef.current.contains(e.relatedTarget)) {
                setIsMenuAnimationInProgress(true);
                setShowMenu(false);
            }
        }
    }

    const handleAnimationEnd = () => {
        setIsMenuAnimationInProgress(false);
    }


    return (
        <div className="flex flex-row h-full w-full">
            <div ref={menuRef} onTransitionEnd={handleAnimationEnd} onMouseOver={handleMouseOverMenu} onMouseOut={handleMouseOut} className={`bg-tertiary-color dark:bg-dark-secondary-color ${showMenu ? 'animate-slideInFromLeft' : 'animate-slideOutToLeft'}`}>
                <NavPanel setIsMenuAnimationInProgress={setIsMenuAnimationInProgress} menuPinned={menuPinned} setMenuPinned={setMenuPinned} showMenu={showMenu} setShowMenu={setShowMenu} />
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