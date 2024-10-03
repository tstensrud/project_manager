import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { GlobalContext } from '../../context/GlobalContext';
import { signOut } from "firebase/auth";

// Hooks and utils
import useFetch from "../../hooks/useFetch";
import { AuthContext } from "../../context/AuthContext";

// Components
import NavbarLink from './NavbarLink';
import NavbarMenuTitle from "./NavbarMenuTitle";
import DarkmodeContainer from "./DarkmodeContainer";

function Navbar() {
    const { currentUser, idToken, dispatch, loading: authLoading } = useContext(AuthContext);
    const { data: userData, loading, refetch: refetchUserInfo } = useFetch(currentUser ? `/user/${currentUser.uid}/` : null);

    const { activeProject, setActiveProject, userUuid, setUserUuid, setUserName, activeProjectName, setActiveProjectName } = useContext(GlobalContext);
    const [displayMenuContainer, setDisplayMenuContainer] = useState(false);
    const [displayDashboardMenu, setDisplayDashboardContainer] = useState(false);

    // useEffects
    useEffect(() => {
        refetchUserInfo();
        const projectData = JSON.parse(sessionStorage.getItem("projectData"));
        if (projectData) {
            const projectId = projectData.projectId;
            const projectName = projectData.projectName;
            setActiveProject(projectId);
            setActiveProjectName(projectName);
        }

    }, []);

    useEffect(() => {
        setUserUuid(userData?.data?.uuid);
        setUserName(userData?.data?.name);
    }, [userData]);

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
                activeProject && activeProject !== "0" && (
                    <>
                        {
                            displayMenuContainer && (
                                <>
                                    <div onMouseEnter={handleShowProjectMenu} onMouseLeave={handleHideProjectMenu} className="absolute flex h-[520px] top-12 bg-secondary-color dark:bg-dark-secondary-color z-[1000] left-12 rounded-lg p-10 shadow shadow-background-shade transition duration-500">
                                        <div className="flex flex-col w-[250px] tracking-wide">
                                            <div className="flex flex-col w-[250px] tracking-wide">
                                                <NavbarMenuTitle title="Prosjekt" />

                                                <NavbarLink url={`project/${activeProject}`} linkText="Prosjektoversikt" />
                                                <NavbarLink url={`buildings/${activeProject}`} linkText="Bygg" />
                                                <NavbarLink url={`rooms/${activeProject}`} linkText="Romliste" />
                                            </div>
                                            <div className="flex flex-col w-[250px] tracking-wide">
                                                <NavbarMenuTitle title="Ventilasjon" />
                                                <NavbarLink url={`ventilation/${activeProject}`} linkText="Luftmengdetabell" />
                                                <NavbarLink url={`ventsystems/${activeProject}`} linkText="Ventilasjonssystemer" />
                                                <NavbarLink url={`ventsystems/${activeProject}/new`} linkText="Legg til system" />
                                            </div>
                                            <div className="flex flex-col w-[250px] tracking-wide">
                                                <NavbarMenuTitle title="Energiberegninger" />
                                                <NavbarLink url={`heating/${activeProject}`} linkText="Varmetapsberegninger" />
                                                <NavbarLink url={`cooling/${activeProject}`} linkText="Kjølebehovsberegninger" />
                                            </div>
                                        </div>

                                        <div className="flex flex-col w-[250px] tracking-wide">
                                            <div className="flex flex-col w-[250px] tracking-wide">
                                                <NavbarMenuTitle title="Sanitær" />

                                                <NavbarLink url={`sanitary/${activeProject}`} linkText="Sammendrag" />
                                                <NavbarLink url={`sanitary/equipment/${activeProject}`} linkText="Sanitærutstyr" />
                                                <NavbarLink url={`sanitary/shafts/${activeProject}`} linkText="Sanitærsjakter" />
                                            </div>
                                            <div className="flex flex-col w-[250px] tracking-wide">
                                                <NavbarMenuTitle title="Annet" />
                                                <NavbarLink url={`settings/${activeProject}`} linkText="Innstillinger" />
                                                <NavbarLink url={`reports/${activeProject}`} linkText="Rapporter" />
                                            </div>
                                        </div>

                                    </div>
                                    <div onClick={handleShadeClick} className="absolute w-full h-full top-[5%] z-[900] bg-background-shade">
                                    </div>
                                </>
                            )
                        }
                    </>
                )
            }

            {
                displayDashboardMenu && (
                    <>

                        <div onMouseEnter={handleShowDashboardMenu} onMouseLeave={handleHideDashboardMenu} className="absolute flex h-[520px] top-12 bg-secondary-color dark:bg-dark-secondary-color z-[1000] right-12 rounded-lg p-10 shadow shadow-background-shade transition duration-500">
                            <div className="flex flex-col w-[250px] tracking-wide">
                                <div className="flex flex-col w-[250px] tracking-wide">
                                    <NavbarMenuTitle title="Prosjekter" />
                                    <NavbarLink url={'newproject'} linkText="Opprett nytt prosjekt" />
                                    <NavbarLink url={'dashboard'} linkText="Velg prosjekt" />
                                </div>

                                <div className="flex flex-col w-[250px] tracking-wide">
                                    <NavbarMenuTitle title="Kravspesifikasjoner" />
                                    <NavbarLink url={`specifications/`} linkText="Kravspesifikasjoner" />
                                    <NavbarLink url={'newspecification'} linkText="Ny kravspesifikasjon" />
                                </div>

                                <div className="flex flex-col w-[250px] tracking-wide">
                                    <NavbarMenuTitle title="Kalkulatorer" />
                                    <NavbarLink url={`calculator/ductflow`} linkText="Lufthastighet kanaler" />
                                </div>

                            </div>

                            <div className="flex flex-col w-[250px] tracking-wide">
                                <div className="flex flex-col w-[250px] tracking-wide">
                                    <NavbarMenuTitle title="Brukervalg" />
                                    <NavbarLink url={'/'} linkText="Min side" />
                                    <NavbarLink url={`logout`} linkText="Logg ut" />
                                </div>
                            </div>
                        </div>
                        <div onClick={handleShadeClick} className="absolute w-full h-full top-[5%] z-[900] bg-background-shade">
                        </div>
                    </>
                )
            }


            <div className="w-full bg-tertiary-color dark:bg-dark-tertiary-color text-primary-color dark:text-dark-primary-color flex min-h-16 max-h-16">
                <div className="flex pl-5 justify-start items-center min-w-[30%] h-gull text-base">
                    {
                        activeProject && activeProject !== "0" && (
                            <div onMouseEnter={handleShowProjectMenu} className="pl-2 pr-2 hover:cursor-default tracking-wide">
                                Prosjektmeny
                            </div>
                        )
                    }

                </div>

                <div className="flex w-[60%] h-full justify-center items-center">
                    {
                        activeProjectName && (
                            <div className="flex items-center justify-center text-center uppercase bg-primary-color dark:bg-dark-tertiary-color rounded-lg pl-10 pr-10 mt-1 mb-1 text-3xl font-semibold text-secondary-color dark:text-dark-primary-color">
                                {activeProjectName}
                            </div>
                        )
                    }
                </div>

                <div className="flex pr-5 justify-end text-end min-w-[30%] h-full text-base items-center">

                    <div onMouseEnter={handleShowDashboardMenu} className="pl-2 pr-2 hover:cursor-default tracking-wide">
                        Dashboard
                    </div>
                    <div className="flex text-center items-center pl-3 h-full border-l dark:border-dark-default-border-color border-default-border-color">
                        <DarkmodeContainer />
                    </div>
                </div>
            </div>
        </>
    );
}

export default Navbar;