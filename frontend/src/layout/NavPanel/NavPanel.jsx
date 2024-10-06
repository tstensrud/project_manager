import SubMenu from "./Submenu";
import { GlobalContext } from '../../context/GlobalContext';
import { useContext, useState } from "react";
import SubMenuItem from "./SubMenuItem";

function NavPanel() {
    const { activeProject, activeProjectName } = useContext(GlobalContext);
    const [showMenu, setShowMenu] = useState(true);

    const projectMenuItems = {
        menuTitle: "Prosjekt",
        menuItems: [
            {
                menuItem: "Prosjektoversikt",
                svg:
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition duration-300 stroke-grey-text dark:stroke-dark-grey-text group-hover:stroke-primary-color group-hover:dark:stroke-dark-primary-color fill-none">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                        <polyline points="9 22 9 12 15 12 15 22"></polyline>
                    </svg>,
                url: `/project/${activeProject}`
            },
            {
                menuItem: "Bygg",
                svg:
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition duration-300 stroke-grey-text dark:stroke-dark-grey-text group-hover:stroke-primary-color group-hover:dark:stroke-dark-primary-color fill-none">
                        <path d="M12.89 1.45l8 4A2 2 0 0 1 22 7.24v9.53a2 2 0 0 1-1.11 1.79l-8 4a2 2 0 0 1-1.79 0l-8-4a2 2 0 0 1-1.1-1.8V7.24a2 2 0 0 1 1.11-1.79l8-4a2 2 0 0 1 1.78 0z"></path>
                        <polyline points="2.32 6.16 12 11 21.68 6.16"></polyline>
                        <line x1="12" y1="22.76" x2="12" y2="11"></line>
                    </svg>,
                url: `/buildings/${activeProject}`
            },
            {
                menuItem: "Romliste",
                svg:
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition duration-300 stroke-grey-text dark:stroke-dark-grey-text group-hover:stroke-primary-color group-hover:dark:stroke-dark-primary-color fill-none">
                        <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2"></polygon>
                        <line x1="12" y1="22" x2="12" y2="15.5"></line>
                        <polyline points="22 8.5 12 15.5 2 8.5"></polyline>
                        <polyline points="2 15.5 12 8.5 22 15.5"></polyline>
                        <line x1="12" y1="2" x2="12" y2="8.5"></line>
                    </svg>,
                url: `/rooms/${activeProject}`
            },
            {
                menuItem: "Innstillinger",
                svg:
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition duration-300 stroke-grey-text dark:stroke-dark-grey-text group-hover:stroke-primary-color group-hover:dark:stroke-dark-primary-color fill-none">
                        <circle cx="12" cy="12" r="3"></circle>
                        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                    </svg>,
                url: `/settings/${activeProject}`
            },
            {
                menuItem: "Rapporter",
                svg:
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition duration-300 stroke-grey-text dark:stroke-dark-grey-text group-hover:stroke-primary-color group-hover:dark:stroke-dark-primary-color fill-none">
                        <path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path>
                        <path d="M22 12A10 10 0 0 0 12 2v10z"></path>
                    </svg>,
                url: `/reports/${activeProject}`
            }
        ]
    }

    const ventilationMenuItems = {
        menuTitle: "Ventilasjon",
        menuItems: [
            {
                menuItem: "Luftmengdetabell",
                svg:
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition duration-300 stroke-grey-text dark:stroke-dark-grey-text group-hover:stroke-primary-color group-hover:dark:stroke-dark-primary-color fill-none">
                        <line x1="8" y1="6" x2="21" y2="6"></line>
                        <line x1="8" y1="12" x2="21" y2="12"></line>
                        <line x1="8" y1="18" x2="21" y2="18"></line>
                        <line x1="3" y1="6" x2="3" y2="6"></line>
                        <line x1="3" y1="12" x2="3" y2="12"></line>
                        <line x1="3" y1="18" x2="3" y2="18"></line>
                    </svg>,
                url: `ventilation/${activeProject}`
            },
            {
                menuItem: "Ventilasjonssytemer",
                svg:
                    <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="transition duration-300 stroke-grey-text dark:stroke-dark-grey-text group-hover:stroke-primary-color group-hover:dark:stroke-dark-primary-color fill-grey-text dark:fill-dark-grey-text ">
                        <path d="M18.91,11.09A7.84,7.84,0,0,0,22,12v2A9.37,9.37,0,0,1,18.17,13l-.08,0A7.84,7.84,0,0,0,15,12a6.15,6.15,0,0,0-2.8.89l-.06,0A8.54,8.54,0,0,1,9,14V12a7.59,7.59,0,0,0,2.3-.86l.06,0A7.86,7.86,0,0,1,15,10a9.37,9.37,0,0,1,3.83,1.05Zm-.08,4A9.37,9.37,0,0,0,15,14a7.86,7.86,0,0,0-3.64,1.08l-.06,0A7.59,7.59,0,0,1,9,16v2a8.54,8.54,0,0,0,3.14-1.06l.06,0A6.15,6.15,0,0,1,15,16a7.84,7.84,0,0,1,3.09.91l.08,0A9.53,9.53,0,0,0,22,18V16a7.84,7.84,0,0,1-3.09-.91ZM19,7.13V4a2,2,0,0,0-2-2H7A2,2,0,0,0,5,4V7.17A9,9,0,0,0,2,6.5v2a8.26,8.26,0,0,1,2.63.66l.1,0L5,9.28v1.89a9,9,0,0,0-3-.67v2a8.26,8.26,0,0,1,2.63.66l.1,0,.27.09v1.89a9,9,0,0,0-3-.67v2a8.26,8.26,0,0,1,2.63.66l.1,0,.27.09V20a2,2,0,0,0,2,2H17a2,2,0,0,0,2-2v-.69L18.17,19l-.08,0c-.38-.17-.74-.33-1.09-.46V20H7V4H17V6.33A6.81,6.81,0,0,0,15,6a7.86,7.86,0,0,0-3.64,1.08l-.06,0A7.59,7.59,0,0,1,9,8v2a8.54,8.54,0,0,0,3.14-1.06l.06,0A6.15,6.15,0,0,1,15,8a7.84,7.84,0,0,1,3.09.91l.08,0A9.53,9.53,0,0,0,22,10V8A7.63,7.63,0,0,1,19,7.13Z" />
                    </svg>,
                url: `ventsystems/${activeProject}`
            },
            {
                menuItem: "Nytt vent.system",
                svg:
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition duration-300 stroke-grey-text dark:stroke-dark-grey-text group-hover:stroke-primary-color group-hover:dark:stroke-dark-primary-color fill-none">
                        <path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2"></path>
                    </svg>,
                url: `ventsystems/${activeProject}/new`
            }
        ],

    };

    const energyMenuItems = {
        menuTitle: "Energiberegninger",
        menuItems: [
            {
                menuItem: "Varmetapsberegninger",
                svg:
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 26" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition duration-300 stroke-grey-text dark:stroke-dark-grey-text group-hover:stroke-primary-color group-hover:dark:stroke-dark-primary-color fill-none">
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
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition duration-300 stroke-grey-text dark:stroke-dark-grey-text group-hover:stroke-primary-color group-hover:dark:stroke-dark-primary-color fill-none">
                        <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"></path>
                    </svg>,
                url: `cooling/${activeProject}`
            }
        ]
    }

    const sanitaryMenuItems = {
        menuTitle: "Sanitæranlegg",
        menuItems: [
            {
                menuItem: "Sammendrag",
                svg:
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition duration-300 stroke-grey-text dark:stroke-dark-grey-text group-hover:stroke-primary-color group-hover:dark:stroke-dark-primary-color fill-none">
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
                svg: <svg fill="#000000" width="18" height="18" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg" strokeWidth={2} xmlns:xlink="http://www.w3.org/1999/xlink" className="transition duration-300 stroke-grey-text dark:stroke-dark-grey-text group-hover:stroke-primary-color group-hover:dark:stroke-dark-primary-color fill-none">
                    <path d="M25 0C17.132813 0 11 7.761719 11 17C11 20.457031 11.859375 23.613281 13.3125 26.28125C13.113281 26.46875 13.003906 26.726563 13 27L13 28L11 28C9.355469 28 8 29.355469 8 31C8 31.203125 8.023438 31.402344 8.0625 31.59375C8.066406 31.601563 8.058594 31.617188 8.0625 31.625C8.085938 31.726563 8.125 31.839844 8.15625 31.9375C8.179688 32.011719 8.21875 32.085938 8.25 32.15625C8.296875 32.269531 8.34375 32.363281 8.40625 32.46875C8.527344 32.679688 8.648438 32.886719 8.8125 33.0625C8.820313 33.074219 8.832031 33.082031 8.84375 33.09375C8.855469 33.105469 8.863281 33.113281 8.875 33.125C8.972656 33.21875 9.078125 33.292969 9.1875 33.375C9.3125 33.472656 9.453125 33.546875 9.59375 33.625C9.695313 33.679688 9.800781 33.738281 9.90625 33.78125C9.9375 33.792969 9.96875 33.800781 10 33.8125L10 34C10 38.457031 12.691406 42.308594 16.53125 44.03125C16.40625 44.175781 16.277344 44.316406 16.15625 44.5C15.550781 45.425781 15 46.878906 15 49C15 49.550781 15.449219 50 16 50L34 50C34.550781 50 35 49.550781 35 49C35 46.878906 34.449219 45.425781 33.84375 44.5C33.722656 44.316406 33.59375 44.175781 33.46875 44.03125C37.308594 42.308594 40 38.457031 40 34L40 33.8125C40.03125 33.800781 40.0625 33.792969 40.09375 33.78125C40.203125 33.738281 40.300781 33.683594 40.40625 33.625C40.546875 33.546875 40.6875 33.472656 40.8125 33.375C40.933594 33.285156 41.050781 33.203125 41.15625 33.09375C41.167969 33.082031 41.175781 33.074219 41.1875 33.0625C41.351563 32.886719 41.472656 32.679688 41.59375 32.46875C41.65625 32.363281 41.703125 32.269531 41.75 32.15625C41.78125 32.085938 41.820313 32.011719 41.84375 31.9375C41.878906 31.832031 41.914063 31.707031 41.9375 31.59375C41.976563 31.402344 42 31.203125 42 31C42 29.355469 40.644531 28 39 28L37 28L37 27C36.996094 26.726563 36.886719 26.46875 36.6875 26.28125C38.140625 23.613281 39 20.457031 39 17C39 7.761719 32.867188 0 25 0 Z M 25 2C31.535156 2 37 8.640625 37 17C37 20.417969 36.050781 23.488281 34.53125 26L33 26C32.96875 26 32.9375 26 32.90625 26C32.390625 26.046875 31.996094 26.480469 32 27L32 28L18 28L18 27C18 26.449219 17.550781 26 17 26L15.46875 26C13.949219 23.488281 13 20.417969 13 17C13 8.640625 18.464844 2 25 2 Z M 25 28C27.320313 28 29.378906 26.660156 30.78125 24.65625C32.183594 22.652344 33 19.949219 33 17C33 14.050781 32.183594 11.347656 30.78125 9.34375C29.378906 7.339844 27.320313 6 25 6C22.679688 6 20.621094 7.339844 19.21875 9.34375C17.816406 11.347656 17 14.050781 17 17C17 19.949219 17.816406 22.652344 19.21875 24.65625C20.621094 26.660156 22.679688 28 25 28 Z M 25 8C26.546875 8 27.996094 8.886719 29.125 10.5C30.253906 12.113281 31 14.425781 31 17C31 19.574219 30.253906 21.886719 29.125 23.5C27.996094 25.113281 26.546875 26 25 26C23.453125 26 22.003906 25.113281 20.875 23.5C19.746094 21.886719 19 19.574219 19 17C19 14.425781 19.746094 12.113281 20.875 10.5C22.003906 8.886719 23.453125 8 25 8 Z M 11 30L39 30C39.554688 30 40 30.445313 40 31C40 31.554688 39.554688 32 39 32L11 32C10.445313 32 10 31.554688 10 31C10 30.863281 10.042969 30.746094 10.09375 30.625C10.246094 30.265625 10.585938 30 11 30 Z M 12 34L38 34C38 38.953125 33.953125 43 29 43L21 43C16.046875 43 12 38.953125 12 34 Z M 18.375 45L31.625 45C31.691406 45.039063 31.828125 45.09375 32.15625 45.59375C32.457031 46.054688 32.738281 46.886719 32.875 48L17.125 48C17.261719 46.886719 17.542969 46.054688 17.84375 45.59375C18.171875 45.09375 18.308594 45.039063 18.375 45Z" />
                </svg>,
                url: `sanitary/equipment/${activeProject}`
            },
            {
                menuItem: "Sanitærsjakter",
                svg: <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="transition duration-300 stroke-grey-text dark:stroke-dark-grey-text group-hover:stroke-primary-color group-hover:dark:stroke-dark-primary-color fill-grey-text dark:fill-dark-grey-text">
                    <path d="M21,5c0-2.626-4.527-4-9-4S3,2.374,3,5V19c0,2.626,4.527,4,9,4s9-1.374,9-4ZM12,3c4.547,0,7,1.419,7,2s-2.453,2-7,2S5,5.581,5,5,7.453,3,12,3Zm0,18c-4.547,0-7-1.419-7-2V7.6A15.855,15.855,0,0,0,12,9a15.855,15.855,0,0,0,7-1.4V19C19,19.581,16.547,21,12,21Z" />
                </svg>,
                url: `sanitary/shafts/${activeProject}`
            }
        ]
    }

    const dashboardMenuItems = {
        menuTitle: "Prosjekter",
        menuItems: [
            {
                menuItem: "Velg prosjekt",
                svg:
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition duration-300 stroke-grey-text dark:stroke-dark-grey-text group-hover:stroke-primary-color group-hover:dark:stroke-dark-primary-color fill-none">
                        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                    </svg>,
                url: "dashboard"
            },
            {
                menuItem: "Nytt prosjekt",
                svg:
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition duration-300 stroke-grey-text dark:stroke-dark-grey-text group-hover:stroke-primary-color group-hover:dark:stroke-dark-primary-color fill-none">
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
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition duration-300 stroke-grey-text dark:stroke-dark-grey-text group-hover:stroke-primary-color group-hover:dark:stroke-dark-primary-color fill-none">
                        <polygon points="16 3 21 8 8 21 3 21 3 16 16 3"></polygon>
                    </svg>,
                url: "specifications"
            },
            {
                menuItem: "Ny kravspek.",
                svg:
                    <svg className="transition duration-300 stroke-primary-color dark:stroke-dark-primary-color fill-none" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
                        <path d="M8 3a3 3 0 0 0-1 5.83v6.34a3.001 3.001 0 1 0 2 0V15a2 2 0 0 1 2-2h1a5.002 5.002 0 0 0 4.927-4.146A3.001 3.001 0 0 0 16 3a3 3 0 0 0-1.105 5.79A3.001 3.001 0 0 1 12 11h-1c-.729 0-1.412.195-2 .535V8.83A3.001 3.001 0 0 0 8 3Z" />
                    </svg>,
                url: "newspecification"
            }

        ]
    }

    const calculatorMenuItems = {
        menuTitle: "Kalkulatorer",
        menuItems: [
            {
                menuItem: "Lufthastighet kanaler",
                svg:
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition duration-300 stroke-grey-text dark:stroke-dark-grey-text group-hover:stroke-primary-color group-hover:dark:stroke-dark-primary-color fill-none">
                        <path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2"></path>
                    </svg>,
                url: "calculator/ductflow"
            }
        ]
    }

    const handleToggleMenu = (e) => {
        e.preventDefault();
        setShowMenu(!showMenu)
    }
    return (
        <>
            {
                !showMenu &&
                <div onClick={handleToggleMenu} className={`dark:bg-dark-secondary-color bg-secondary-color cursor-pointer ${!showMenu ? 'animate-slideInFromLeft' : 'animate-slideOutToLeft'} flex flex-col items-center border-t border-r border-b dark:border-dark-default-border-color justify-center w-6 h-10 absolute top-1/2 -translate-y-1/2 rounded-tr-lg rounded-br-lg hover:dark:border-dark-accent-color hover:border-accent-color`}>
                    <div className="rotate-180">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" stroke-width="2" strokeLinecap="round" strokeLinejoin="round" className="stroke-accent-color dark:stroke-dark-accent-color group-hover:stroke-primary-color group-hover:dark:stroke-dark-primary-color  transition duration-300 fill-none">
                            <polyline points="15 18 9 12 15 6"></polyline>
                        </svg>
                    </div>
                </div>
            }

            <div className={`absolute z-50 top-1/2 -translate-y-1/2 ${showMenu ? 'animate-slideInFromLeft' : 'animate-slideOutToLeft'} flex flex-row w-70 h-4/5 overflor-x-hidden`}>
                <div className="ml-3 w-60 flex flex-col  dark:bg-dark-tertiary-color bg-tertiary-color rounded-lg border dark:border-dark-default-border-color overflow-y-auto">
                    <div onClick={handleToggleMenu} className="group cursor-pointer flex items-center pt-2 pl-2 pb-3 border-b dark:border-dark-default-border-color h-12 text-grey-text dark:text-dark-grey-text">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" stroke-width="2" strokeLinecap="round" strokeLinejoin="round" className="stroke-grey-text dark:stroke-dark-grey-text group-hover:stroke-primary-color group-hover:dark:stroke-dark-primary-color  transition duration-300 fill-none">
                            <polyline points="15 18 9 12 15 6"></polyline>
                        </svg>
                        <div className="group-hover:text-primary-color pl-4 group-hover:dark:text-dark-primary-color transition duration-300">
                            Lukk meny
                        </div>
                    </div>

                    {
                        activeProject && activeProject !== "0" &&
                        <div className="flex flex-col border-b border-table-border-color dark:border-dark-default-border-color pb-3">
                            <div className="w-full flex items-center justify-center pt-2 text-center text-primary-color dark:text-dark-primary-color">
                                {activeProjectName}
                            </div>
                            <div className="pl-2 pr-2 pt-1">
                                <SubMenu menu={projectMenuItems} />
                                <SubMenu menu={ventilationMenuItems} />
                                <SubMenu menu={energyMenuItems} />
                                <SubMenu menu={sanitaryMenuItems} />
                            </div>
                        </div>
                    }

                    <div className="pb-3">
                        <div className="flex flex-col pl-2 pr-2 pt-3">
                            <SubMenu menu={dashboardMenuItems} />
                            <SubMenu menu={calculatorMenuItems} />
                        </div>
                    </div>
                    <div className="flex flex-1 items-end">
                        <div className="border-t pt-1 pb-1 w-full border-table-border-color dark:border-dark-default-border-color">
                            <SubMenuItem text="Min side" url="/" svg={<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" className="transition duration-300 stroke-grey-text dark:stroke-dark-grey-text group-hover:stroke-primary-color group-hover:dark:stroke-dark-primary-color fill-none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                            </svg>} />
                            <SubMenuItem text="Logg ut" url="/logout" svg={<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" className="transition duration-300 stroke-grey-text dark:stroke-dark-grey-text group-hover:stroke-primary-color group-hover:dark:stroke-dark-primary-color fill-none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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