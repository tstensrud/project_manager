import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { Link } from 'react-router-dom';
import { GlobalContext } from '../GlobalContext';
import useFetch from "../hooks/useFetch";
import TodoButton from './TodoButton';
import AccountIcon from '../assets/svg/accountIcon.svg?react';



function Navbar() {
    const { activeProject, setActiveProject, userUuid, setUserUuid, userName, setUserName, activeProjectName, setActiveProjectName } = useContext(GlobalContext);
    const [navButtonClass, setNavButtonClass] = useState('dropdown-content-disabled');
    const {data: userData, loading, error, refetch: refetchUserInfo} = useFetch(`/get_user/`);

    useEffect(() => {
        refetchUserInfo();
        const projectName = localStorage.getItem("projectname");
        const projectId = localStorage.getItem("projectid");
        setActiveProjectName(projectName);
        setActiveProject(projectId);
    },[]);

    useEffect(() => {
        setUserUuid(userData && userData.user.uuid);
        setUserName(userData && userData.user.name);
    },[userData]);

    useEffect(() => {
        if (activeProject !== "0" && activeProject !== null && activeProject !== undefined) {
            setNavButtonClass("dropdown-content");
        } else {
            setNavButtonClass("dropdown-content-disabled");
        }
    },[activeProject]);

    return (
        <>
            {
                (activeProject && activeProject !== "0") ? (
                    <TodoButton />
                ) : (<></>)
            }

            <div className="header no-print">
                <div className="navbar-button-container">
                    <div className="dropdown">
                        <button className='dropbtn'>Prosjekt
                            <i className="fa fa-caret-down"></i>
                        </button>
                        <div className={navButtonClass}>
                            <Link to={`project/${activeProject}`}>Forside</Link>
                            <Link to={`buildings/${activeProject}`}>Bygg</Link>
                            <Link to={`rooms/${activeProject}`}>Romoversikt</Link>
                            <Link to={`ventsystems/${activeProject}`}>Ventilasjonssystemer</Link>
                            <Link to={`ventilation/${activeProject}`}>Luftmengdeskjema</Link>
                            <Link to={`heating/${activeProject}`}>Varmeberegninger</Link>
                            <Link to={`cooling/${activeProject}`}>Kjøleberegninger</Link>
                            <Link to={`sanitary/${activeProject}`}>Sanitæranlegg</Link>
                            <Link to={`sanitary/equipment/${activeProject}`}>Sanitærutstyr</Link>
                            <Link to={`sanitary/shafts/${activeProject}`}>Sanitærsjakter</Link>
                            <Link to={``}>Rapporter</Link>
                            <Link to={`settings/${activeProject}`}>Prosjektinnstillinger</Link>
                        </div>
                    </div>

                    <div className="dropdown">
                        <button className="dropbtn">Dashboard
                            <i className="fa fa-caret-down"></i>
                        </button>
                        <div className="dropdown-content">
                            <Link to={'dashboard'}>Velg prosjekt</Link>
                            <Link to={'newproject'}>Nytt prosjekt</Link>
                        </div>
                    </div>


                </div>

                <div className="active-project-title-container">
                    <span className="page-title-text">{activeProjectName}</span>
                </div>

                <div className="navbar-button-container-right">
                    <div className="logout-dropdown">
                        <div className="dropdown">
                            <button className="dropbtn">Kravspesifikasjoner
                                <i className="fa fa-caret-down"></i>
                            </button>
                            <div className="dropdown-content">
                                <Link to={`specifications/${activeProject}`}>Kravspesifikasjoner</Link>
                                <Link to={'newspecification'}>Ny kravspesifikasjon</Link>
                            </div>
                        </div>
                        <div className="dropdown">
                            <button className="dropbtn">{userName}&nbsp;&nbsp;<AccountIcon />
                                <i className="fa fa-caret-down"></i>
                            </button>
                            <div className="dropdown-content">
                                <Link to={'userprofile/'}>Brukerkonto</Link>
                                <Link to={`logout/${userUuid}`}>Logg ut</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Navbar;