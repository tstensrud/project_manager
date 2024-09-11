import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { Link } from 'react-router-dom';
import { GlobalContext } from '../GlobalContext';

// Hooks
import useFetch from "../hooks/useFetch";

// SVG
import MoonIcon from '../assets/svg/moonIcon.svg?react';
import SunIcon from '../assets/svg/sunIcon.svg?react';



function Navbar() {
    const { activeProject, setActiveProject, userUuid, setUserUuid, userName, setUserName, activeProjectName, setActiveProjectName, darkmode, setDarkmode } = useContext(GlobalContext);
    const { data: userData, loading, error, refetch: refetchUserInfo } = useFetch(`/get_user/`);
    const [displayMenuContainer, setDisplayMenuContainer] = useState(false);
    const [displayDashboardMenu, setDisplayDashboardContainer] = useState(false);

    // useEffects
    useEffect(() => {
        refetchUserInfo();
        const projectData = JSON.parse(localStorage.getItem("projectData"))
        if (projectData) {
            const projectId = projectData.projectId;
            const projectName = projectData.projectName;
            setActiveProject(projectId);
            setActiveProjectName(projectName);
        }

    }, []);

    useEffect(() => {
        setUserUuid(userData && userData.user.uuid);
        setUserName(userData && userData.user.name);
    }, [userData]);

    // Handlers
    const toggleDarkModeContainer = () => {
        setDarkmode(!darkmode);
    }

    const handleShowProjectMenu = () => setDisplayMenuContainer(true);
    const handleHideProjectMenu = () => setDisplayMenuContainer(false);
    const handleShowDashboardMenu = () => setDisplayDashboardContainer(true);
    const handleHideDashboardMenu = () => setDisplayDashboardContainer(false);

    const handleShadeClick = () => {
        setDisplayMenuContainer(false);
        setDisplayDashboardContainer(false);
    }
    
    return (
        <>
            {
                activeProject !== "0" && activeProject !== null && activeProject !== undefined ? (
                    <>
                        {
                            displayMenuContainer && (
                                <>
                                    <div onMouseEnter={handleShowProjectMenu} onMouseLeave={handleHideProjectMenu} className="project-menu-container">
                                        <div className="menu-sub-container">
                                            <div className="menu-sub-sub-container">
                                                <div className="menu-item-title">Prosjekt</div>
                                                <div className="menu-link-container"><Link className="menu-link" to={`project/${activeProject}`}>Prosjektoversikt</Link></div>
                                                <div className="menu-link-container"><Link className="menu-link" to={`buildings/${activeProject}`}>Bygg</Link></div>
                                                <div className="menu-link-container"><Link className="menu-link" to={`rooms/${activeProject}`}>Romliste</Link></div>
                                            </div>
                                            <div className="menu-sub-sub-container">
                                                <div className="menu-item-title">Ventilasjon</div>
                                                <div className="menu-link-container"><Link className="menu-link" to={`ventilation/${activeProject}`}>Luftmengdetabell</Link></div>
                                                <div className="menu-link-container"><Link className="menu-link" to={`ventsystems/${activeProject}`}>Ventilasjonssystemer</Link></div>
                                                <div className="menu-link-container"><Link className="menu-link" to={`ventsystems/${activeProject}/new`}>Legg til system</Link></div>
                                            </div>
                                            <div className="menu-sub-sub-container">
                                                <div className="menu-item-title">Energiberegninger</div>
                                                <div className="menu-link-container"><Link className="menu-link" to={`heating/${activeProject}`}>Varmetapsberegninger</Link></div>
                                                <div className="menu-link-container"><Link className="menu-link" to={`cooling/${activeProject}`}>Kjølebehovsberegninger</Link></div>
                                            </div>
                                        </div>

                                        <div className="menu-sub-container">
                                            <div className="menu-sub-sub-container">
                                                <div className="menu-item-title">Sanitær</div>
                                                <div className="menu-link-container"><Link className="menu-link" to={`sanitary/${activeProject}`}>Sammendrag</Link></div>
                                                <div className="menu-link-container"><Link className="menu-link" to={`sanitary/equipment/${activeProject}`}>Sanitærutstyr</Link></div>
                                                <div className="menu-link-container"><Link className="menu-link" to={`sanitary/shafts/${activeProject}`}>Sanitærsjakter</Link></div>
                                            </div>
                                            <div className="menu-sub-sub-container">
                                                <div className="menu-item-title">Annet</div>
                                                <div className="menu-link-container"><Link className="menu-link" to={`settings/${activeProject}`}>Innstillinger</Link></div>
                                                <div className="menu-link-container"><Link className="menu-link" to={`reports/${activeProject}`}>Rapporter</Link></div>
                                            </div>
                                        </div>

                                    </div>
                                    <div onClick={handleShadeClick} className="background-shader">
                                    </div>
                                </>
                            )
                        }
                    </>) : (<></>)
            }

            {
                displayDashboardMenu && (
                    <>

                        <div onMouseEnter={handleShowDashboardMenu} onMouseLeave={handleHideDashboardMenu} className="dashboard-menu-container">
                            <div className="menu-sub-container">
                                <div className="menu-sub-sub-container">
                                    <div className="menu-item-title">Prosjekter</div>
                                    <div className="menu-link-container"><Link className="menu-link" to={'newproject'}>Opprett nytt prosjekt</Link></div>
                                    <div className="menu-link-container"><Link className="menu-link" to={'dashboard'}>Velg prosjekt</Link></div>
                                </div>

                                <div className="menu-sub-sub-container">
                                    <div className="menu-item-title">Kravspesifikasjoner</div>
                                    <div className="menu-link-container"><Link className="menu-link" to={`specifications/`}>Kravspesifikasjoner</Link></div>
                                    <div className="menu-link-container"><Link className="menu-link" to={'newspecification'}>Ny kravspesifikasjon</Link></div>
                                </div>

                                <div className="menu-sub-sub-container">
                                    <div className="menu-item-title">Kalkulatorer</div>
                                    <div className="menu-link-container"><Link className="menu-link" to={`calculator/ductflow`}>Lufthastighet kanaler</Link></div>
                                </div>

                            </div>

                            <div className="menu-sub-container">
                                <div className="menu-sub-sub-container">
                                    <div className="menu-item-title">Brukerkonto</div>
                                    <div className="menu-link-container"><Link className="menu-link" to={'userprofile'}>Konto</Link></div>
                                    <div className="menu-link-container"><Link className="menu-link" to={`logout/${userUuid}`}>Logg ut</Link></div>
                                </div>
                            </div>
                        </div>
                        <div onClick={handleShadeClick} className="background-shader">
                        </div>
                    </>
                )
            }


            <div className="header no-print">
                <div className="navbar-button-container">
                    {
                        activeProject !== "0" && activeProject !== null && activeProject !== undefined ? (
                            <>
                                <div onMouseEnter={handleShowProjectMenu} className="navbar-show-menu-button">
                                    Prosjektmeny
                                </div>
                            </>
                        ) : (<></>)
                    }

                </div>

                <div className="active-project-title-container">
                    {
                        activeProjectName && activeProjectName ? (
                            <div className="page-title-container">
                                <span className="page-title-text">
                                    {activeProjectName}
                                </span>
                            </div>
                        ) : (<></>)
                    }
                </div>

                <div className="navbar-button-container-right">

                    <div onMouseEnter={handleShowDashboardMenu} className="navbar-show-menu-button">
                        Dashboard
                    </div>

                    <div className="darkmode-container">
                        <div style={{ display: "flex", marginRight: "10px" }}>
                            <MoonIcon />
                        </div>
                        <div className="toggle-switch">
                            <input onClick={toggleDarkModeContainer} type="checkbox" id="toggle" />
                            <label htmlFor="toggle" className="slider"></label>
                        </div>
                        <div style={{ display: "flex", marginLeft: "10px" }}>
                            <SunIcon />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Navbar;