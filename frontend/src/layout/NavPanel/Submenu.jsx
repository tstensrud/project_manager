import { useState } from "react";
import SubMenuItem from "./SubMenuItem";

function SubMenu({ menu, menuIndex, activeNavIndex, setActiveNavIndex }) {
    const [showMenu, setShowMenu] = useState(false);

    const handleOpenMenu = (e) => {
        e.preventDefault();
        setShowMenu(!showMenu);
    }

    return (
        <div className="flex flex-col">

            <div onClick={handleOpenMenu} className={`group cursor-pointer flex justify-between flex-row w-full h-full items-center ${showMenu && 'bg-tertiary-color dark:bg-dark-navbar-active-bg-color'}  pl-2 pr-2 pt-2 pb-2 rounded-lg transition duration-300`}>
                <div className={`flex tracking-wide ${showMenu ? "text-primary-color dark:text-dark-primary-color rounded-lg":"text-grey-text dark:text-dark-grey-text"}  group-hover:text-primary-color group-hover:dark:text-dark-primary-color transition duration-300`}>
                    {menu.menuTitle}
                </div>
                <div className={`flex h-full items-center ${!showMenu && 'rotate-180'}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`stroke-grey-text dark:stroke-dark-grey-text fill-none group-hover:stroke-primary-color group-hover:dark:stroke-dark-primary-color tansition duration-300`}>
                        <polyline points="18 15 12 9 6 15"></polyline>
                    </svg>
                </div>
            </div>
            <div className={showMenu ? 'flex flex-col max-h-96 transition-all duration-700 ease-in-out overflow-y-auto pt-1 pb-1' : `max-h-0 overflow-hidden transition-all duration-700 ease-in-out`}>
                {
                    menu.menuItems.map((item, index) => (
                        <SubMenuItem activeNavIndex={activeNavIndex} setActiveNavIndex={setActiveNavIndex} key={index} svg={item.svg} text={item.menuItem} url={item.url} index={`${menuIndex}${index}`} />
                    ))
                }
            </div>
        </div>
    );
}

export default SubMenu;