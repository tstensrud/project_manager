import { useContext, useState } from "react";

// hooks and utils
import { GlobalContext } from '../../context/GlobalContext';

// components
import SubMenu from "./Submenu";
import SubMenuItem from "./SubMenuItem";

function NavPanel() {
    const { activeProject, activeProjectName } = useContext(GlobalContext);
    const [showMenu, setShowMenu] = useState(true);
    const [activeNavIndex, setActiveNavIndex] = useState(0);

    const menuItemsCssClasses = "transition duration-300 stroke-2 stroke-grey-text dark:stroke-dark-grey-text group-hover:stroke-primary-color group-hover:dark:stroke-dark-primary-color fill-none";
    const svgDimension = 18;

    const navPanel = [
        {
            menu: {
                menuTitle: "Prosjekt",
                menuItems: [
                    {
                        menuItem: "Prosjektoversikt",
                        svg:
                            <svg xmlns="http://www.w3.org/2000/svg" width={svgDimension} height={svgDimension} viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className={menuItemsCssClasses}>
                                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                                <polyline points="9 22 9 12 15 12 15 22"></polyline>
                            </svg>,
                        url: `/project/${activeProject}`,
                    },
                    {
                        menuItem: "Bygg",
                        svg:
                            <svg xmlns="http://www.w3.org/2000/svg" width={svgDimension} height={svgDimension} viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className={menuItemsCssClasses}>
                                <path d="M12.89 1.45l8 4A2 2 0 0 1 22 7.24v9.53a2 2 0 0 1-1.11 1.79l-8 4a2 2 0 0 1-1.79 0l-8-4a2 2 0 0 1-1.1-1.8V7.24a2 2 0 0 1 1.11-1.79l8-4a2 2 0 0 1 1.78 0z"></path>
                                <polyline points="2.32 6.16 12 11 21.68 6.16"></polyline>
                                <line x1="12" y1="22.76" x2="12" y2="11"></line>
                            </svg>,
                        url: `/buildings/${activeProject}`,
                    },
                    {
                        menuItem: "Romskjema",
                        svg:
                            <svg xmlns="http://www.w3.org/2000/svg" width={svgDimension} height={svgDimension} viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className={menuItemsCssClasses}>
                                <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2"></polygon>
                                <line x1="12" y1="22" x2="12" y2="15.5"></line>
                                <polyline points="22 8.5 12 15.5 2 8.5"></polyline>
                                <polyline points="2 15.5 12 8.5 22 15.5"></polyline>
                                <line x1="12" y1="2" x2="12" y2="8.5"></line>
                            </svg>,
                        url: `/rooms/${activeProject}`,
                    },
                    {
                        menuItem: "Innstillinger",
                        svg:
                            <svg xmlns="http://www.w3.org/2000/svg" width={svgDimension} height={svgDimension} viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className={menuItemsCssClasses}>
                                <circle cx="12" cy="12" r="3"></circle>
                                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                            </svg>,
                        url: `/settings/${activeProject}`,
                    },
                    {
                        menuItem: "Rapporter",
                        svg:
                            <svg xmlns="http://www.w3.org/2000/svg" width={svgDimension} height={svgDimension} viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className={menuItemsCssClasses}>
                                <path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path>
                                <path d="M22 12A10 10 0 0 0 12 2v10z"></path>
                            </svg>,
                        url: `/reports/${activeProject}`,
                    }
                ]
            }
        },

        {
            menu: {
                menuTitle: "Ventilasjon",
                menuItems: [
                    {
                        menuItem: "Luftmengdetabell",
                        svg:
                            <svg xmlns="http://www.w3.org/2000/svg" width={svgDimension} height={svgDimension} viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className={menuItemsCssClasses}>
                                <line x1="8" y1="6" x2="21" y2="6"></line>
                                <line x1="8" y1="12" x2="21" y2="12"></line>
                                <line x1="8" y1="18" x2="21" y2="18"></line>
                                <line x1="3" y1="6" x2="3" y2="6"></line>
                                <line x1="3" y1="12" x2="3" y2="12"></line>
                                <line x1="3" y1="18" x2="3" y2="18"></line>
                            </svg>,
                        url: `ventilation/${activeProject}`,
                    },
                    {
                        menuItem: "Ventilasjonssytemer",
                        svg:
                            <svg width={svgDimension} height={svgDimension} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="transition duration-300 stroke-grey-text dark:stroke-dark-grey-text group-hover:stroke-primary-color group-hover:dark:stroke-dark-primary-color fill-grey-text dark:fill-dark-grey-text ">
                                <path d="M18.91,11.09A7.84,7.84,0,0,0,22,12v2A9.37,9.37,0,0,1,18.17,13l-.08,0A7.84,7.84,0,0,0,15,12a6.15,6.15,0,0,0-2.8.89l-.06,0A8.54,8.54,0,0,1,9,14V12a7.59,7.59,0,0,0,2.3-.86l.06,0A7.86,7.86,0,0,1,15,10a9.37,9.37,0,0,1,3.83,1.05Zm-.08,4A9.37,9.37,0,0,0,15,14a7.86,7.86,0,0,0-3.64,1.08l-.06,0A7.59,7.59,0,0,1,9,16v2a8.54,8.54,0,0,0,3.14-1.06l.06,0A6.15,6.15,0,0,1,15,16a7.84,7.84,0,0,1,3.09.91l.08,0A9.53,9.53,0,0,0,22,18V16a7.84,7.84,0,0,1-3.09-.91ZM19,7.13V4a2,2,0,0,0-2-2H7A2,2,0,0,0,5,4V7.17A9,9,0,0,0,2,6.5v2a8.26,8.26,0,0,1,2.63.66l.1,0L5,9.28v1.89a9,9,0,0,0-3-.67v2a8.26,8.26,0,0,1,2.63.66l.1,0,.27.09v1.89a9,9,0,0,0-3-.67v2a8.26,8.26,0,0,1,2.63.66l.1,0,.27.09V20a2,2,0,0,0,2,2H17a2,2,0,0,0,2-2v-.69L18.17,19l-.08,0c-.38-.17-.74-.33-1.09-.46V20H7V4H17V6.33A6.81,6.81,0,0,0,15,6a7.86,7.86,0,0,0-3.64,1.08l-.06,0A7.59,7.59,0,0,1,9,8v2a8.54,8.54,0,0,0,3.14-1.06l.06,0A6.15,6.15,0,0,1,15,8a7.84,7.84,0,0,1,3.09.91l.08,0A9.53,9.53,0,0,0,22,10V8A7.63,7.63,0,0,1,19,7.13Z" />
                            </svg>,
                        url: `ventsystems/${activeProject}`
                    },
                    {
                        menuItem: "Nytt vent.system",
                        svg:
                            <svg xmlns="http://www.w3.org/2000/svg" width={svgDimension} height={svgDimension} viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className={menuItemsCssClasses}>
                                <path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2"></path>
                            </svg>,
                        url: `ventsystems/${activeProject}/new`
                    }
                ],

            }
        },

        {
            menu: {
                menuTitle: "Energiberegninger",
                menuItems: [
                    {
                        menuItem: "Varmetapsberegninger",
                        svg:
                            <svg xmlns="http://www.w3.org/2000/svg" width={svgDimension} height={svgDimension} viewBox="0 0 24 26" strokeLinecap="round" strokeLinejoin="round" className={menuItemsCssClasses}>
                                <circle cx="12" cy="12" r="5"></circle>
                                <line x1="12" y1="1" x2="12" y2="3"></line>
                                <line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line>
                                <line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                            </svg>,
                        url: `heating/${activeProject}`
                    },
                    {
                        menuItem: "Kjølebehovsberegninger",
                        svg:
                            <svg xmlns="http://www.w3.org/2000/svg" width={svgDimension} height={svgDimension} viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className={menuItemsCssClasses}>
                                <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"></path>
                            </svg>,
                        url: `cooling/${activeProject}`
                    }
                ]
            }
        },

        {
            menu: {
                menuTitle: "Sanitæranlegg",
                menuItems: [
                    {
                        menuItem: "Sammendrag",
                        svg:
                            <svg xmlns="http://www.w3.org/2000/svg" width={svgDimension} height={svgDimension} viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className={menuItemsCssClasses}>
                                <line x1="8" y1="19" x2="8" y2="21"></line>
                                <line x1="8" y1="13" x2="8" y2="15"></line>
                                <line x1="16" y1="19" x2="16" y2="21"></line>
                                <line x1="16" y1="13" x2="16" y2="15"></line>
                                <line x1="12" y1="21" x2="12" y2="23"></line>
                                <line x1="12" y1="15" x2="12" y2="17"></line>
                                <path d="M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25"></path>
                            </svg>,
                        url: `sanitary/${activeProject}`
                    },
                    {
                        menuItem: "Sanitærustyr",
                        svg:
                            <svg version="1.1" height={svgDimension} width={svgDimension} xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512" xml:space="preserve" className={menuItemsCssClasses}>
                                <g>
                                    <path className="dark:fill-dark-grey-text fill-grey-text" d="M73.41,512h233.41v-63.997c60.239-7.534,131.77-101.65,131.77-161.88H73.41V512z" />
                                    <rect x="73.41" className="dark:fill-dark-grey-text fill-grey-text" width="128.002" height="267.289" />
                                    <path className="dark:fill-dark-grey-text fill-grey-text" d="M413.848,222.118H222.744v45.17H438.59v-20.438C438.59,233.198,427.51,222.118,413.848,222.118z" />
                                </g>
                            </svg>,
                        url: `sanitary/equipment/${activeProject}`
                    },
                    {
                        menuItem: "Sanitærsjakter",
                        svg: <svg width={svgDimension} height={svgDimension} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className={menuItemsCssClasses}>
                            <path className="dark:fill-dark-grey-text fill-grey-text" d="M21,5c0-2.626-4.527-4-9-4S3,2.374,3,5V19c0,2.626,4.527,4,9,4s9-1.374,9-4ZM12,3c4.547,0,7,1.419,7,2s-2.453,2-7,2S5,5.581,5,5,7.453,3,12,3Zm0,18c-4.547,0-7-1.419-7-2V7.6A15.855,15.855,0,0,0,12,9a15.855,15.855,0,0,0,7-1.4V19C19,19.581,16.547,21,12,21Z" />
                        </svg>,
                        url: `sanitary/shafts/${activeProject}`
                    }
                ]
            }
        },

        {
            menu: {
                menuTitle: "Portal",
                menuItems: [
                    {
                        menuItem: "Velg prosjekt",
                        svg:
                            <svg xmlns="http://www.w3.org/2000/svg" width={svgDimension} height={svgDimension} viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className={menuItemsCssClasses}>
                                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                            </svg>,
                        url: "dashboard"
                    },
                    {
                        menuItem: "Nytt prosjekt",
                        svg:
                            <svg xmlns="http://www.w3.org/2000/svg" width={svgDimension} height={svgDimension} viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className={menuItemsCssClasses}>
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                <polyline points="14 2 14 8 20 8"></polyline>
                                <line x1="12" y1="18" x2="12" y2="12"></line>
                                <line x1="9" y1="15" x2="15" y2="15"></line>
                            </svg>,
                        url: "newproject"
                    },
                    {
                        menuItem: "Kravspesifikasjoner",
                        svg:
                            <svg xmlns="http://www.w3.org/2000/svg" width={svgDimension} height={svgDimension} viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className={menuItemsCssClasses}>
                                <polygon points="16 3 21 8 8 21 3 21 3 16 16 3"></polygon>
                            </svg>,
                        url: "specifications"
                    },
                    {
                        menuItem: "Ny kravspek.",
                        svg:
                            <svg className={menuItemsCssClasses} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width={svgDimension} height={svgDimension} viewBox="0 0 24 24">
                                <path d="M8 3a3 3 0 0 0-1 5.83v6.34a3.001 3.001 0 1 0 2 0V15a2 2 0 0 1 2-2h1a5.002 5.002 0 0 0 4.927-4.146A3.001 3.001 0 0 0 16 3a3 3 0 0 0-1.105 5.79A3.001 3.001 0 0 1 12 11h-1c-.729 0-1.412.195-2 .535V8.83A3.001 3.001 0 0 0 8 3Z" />
                            </svg>,
                        url: "newspecification"
                    }

                ]
            }
        },

        {
            menu: {
                menuTitle: "Kalkulatorer",
                menuItems: [
                    {
                        menuItem: "Lufthastighet kanaler",
                        svg:
                            <svg xmlns="http://www.w3.org/2000/svg" width={svgDimension} height={svgDimension} viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className={menuItemsCssClasses}>
                                <path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2"></path>
                            </svg>,
                        url: "calculator/ductflow"
                    }
                ]
            }
        }
    ];

    const handleToggleMenu = (e) => {
        e.preventDefault();
        setShowMenu(!showMenu)
    }


    return (
        <>
            {
                !showMenu &&
                <div onClick={handleToggleMenu} className={`group dark:bg-dark-secondary-color bg-secondary-color hover:bg-accent-color cursor-pointer ${!showMenu ? 'animate-slideInFromLeft' : 'animate-slideOutToLeft'} flex flex-col items-center border-t border-r border-b dark:border-dark-accent-color justify-center w-6 h-16 absolute top-1/2 -translate-y-1/2 rounded-tr-lg rounded-br-lg border-accent-color hover:dark:bg-dark-navbar-hover-bg-color transaition duration-300`}>
                    <div className="rotate-180">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className="stroke-primary-color stroke-2 dark:stroke-dark-primary-color transition group-hover:stroke-secondary-color duration-300 fill-none">
                            <polyline points="15 18 9 12 15 6"></polyline>
                        </svg>
                    </div>
                </div>
            }

            <div className={`absolute z-50 top-1/2 -translate-y-1/2 ${showMenu ? 'animate-slideInFromLeft' : 'animate-slideOutToLeft'} flex flex-row w-70 h-4/5 overflor-x-hidden`}>
                <div className="ml-3 w-60 flex flex-col border-primary-color  bg-secondary-color rounded-lg border dark:border-dark-default-border-color dark:bg-dark-tertiary-color overflow-y-auto">

                    <div onClick={handleToggleMenu} className="group sticky top-0 bg-secondary-color dark:bg-dark-tertiary-color cursor-pointer flex items-center pt-2 pl-2 pb-3 border-b dark:border-dark-default-border-color h-12 text-grey-text dark:text-dark-grey-text">
                        <div className="flex items-center justify-center w-7 h-7 border border-accent-color bg-tertiary-color group-hover:bg-accent-color dark:bg-dark-tertiary-color dark:border-dark-accent-color rounded-lg transition duration-300 group-hover:dark:bg-dark-navbar-active-bg-color">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className="stroke-grey-text stroke-2 group-hover:stroke-secondary-color dark:stroke-dark-grey-text group-hover:dark:stroke-dark-primary-color transition duration-300 fill-none">
                                <polyline points="15 18 9 12 15 6"></polyline>
                            </svg>
                        </div>

                    </div>

                    <div className={`flex flex-col ${activeProjectName && activeProjectName !== "0" && 'border-b pb-3'}border-table-border-color dark:border-dark-default-border-color`}>
                        <div className="w-full flex items-center justify-center pt-2 text-center text-primary-color dark:text-dark-primary-color">
                            {activeProjectName}
                        </div>
                        {
                            activeProjectName && activeProjectName !== "0" && (
                                <>
                                    {
                                        navPanel.map((subMenu, index) => (
                                            <>
                                                {
                                                    subMenu.menu.menuTitle !== "Portal" && subMenu.menu.menuTitle !== "Kalkulatorer" && (
                                                        <div className="pl-2 pr-2 pt-2">
                                                            <SubMenu activeNavIndex={activeNavIndex} setActiveNavIndex={setActiveNavIndex} key={index} menuIndex={index} menu={subMenu.menu} />
                                                        </div>
                                                    )
                                                }
                                            </>
                                        )

                                        )
                                    }
                                </>
                            )
                        }

                    </div>
                    <div className="pb-3">
                        <div className="flex flex-col pl-2 pr-2 pt-3">
                            {

                                navPanel.map((subMenu, index) => (
                                    <>
                                        {
                                            (subMenu.menu.menuTitle === "Portal" || subMenu.menu.menuTitle === "Kalkulatorer") && (
                                                <div className="pl-1 pt-2">
                                                    <SubMenu activeNavIndex={activeNavIndex} setActiveNavIndex={setActiveNavIndex} key={index} menuIndex={index} menu={subMenu.menu} />
                                                </div>
                                            )
                                        }
                                    </>
                                )
                                )
                            }
                        </div>
                    </div>

                    <div className="flex flex-1 items-end">
                        <div className="border-t pl-2 pr-2 pt-1 pb-1 w-full border-table-border-color dark:border-dark-default-border-color">
                            <SubMenuItem activeNavIndex={activeNavIndex} setActiveNavIndex={setActiveNavIndex} index={100} text="Min side" url="/" svg={
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" className="transition duration-300 stroke-grey-text dark:stroke-dark-grey-text group-hover:stroke-primary-color group-hover:dark:stroke-dark-primary-color fill-none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="12" cy="7" r="4"></circle>
                                </svg>} />
                            <SubMenuItem activeNavIndex={activeNavIndex} setActiveNavIndex={setActiveNavIndex} index={101} text="Logg ut" url="/logout" svg={
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" className="transition duration-300 stroke-grey-text dark:stroke-dark-grey-text group-hover:stroke-primary-color group-hover:dark:stroke-dark-primary-color fill-none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M10 22H5a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h5"></path>
                                    <polyline points="17 16 21 12 17 8"></polyline>
                                    <line x1="21" y1="12" x2="9" y2="12"></line>
                                </svg>} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default NavPanel;