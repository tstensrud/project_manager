import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { Link } from 'react-router-dom';
import { GlobalContext } from '../GlobalContext';
import AccountIcon from '../assets/svg/accountIcon.svg?react';



function Navbar() {
    const { activeProject, userUuid, userName, setActiveProject, activeProjectName } = useContext(GlobalContext);
    const [disabledNavButton, setDisabledNavButton] = useState('dropdown-content-disabled');

    return (
        <>
            <div className="header">
                <div className="navbar-button-container">
                    <div className="dropdown">
                        <button className='dropbtn'>Prosjekt
                            <i className="fa fa-caret-down"></i>
                        </button>
                        <div className="dropdown-content">
                            <Link to={`project/${activeProject}`}>Forside</Link>
                            <Link to={`buildings/${activeProject}`}>Bygg</Link>
                            <Link to={`rooms/${activeProject}`}>Romoversikt</Link>
                            <Link to={`ventsystems/${activeProject}`}>Ventilasjonssystemer</Link>
                            <Link to={`ventilation/${activeProject}`}>Luftmengdeskjema</Link>
                            <Link to={`heating/${activeProject}`}>Varmeberegninger</Link>
                            <Link to={`cooling/${activeProject}`}>Kjøleberegninger</Link>
                            <Link to={``}>Tappevann</Link>
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
                            <Link to={`specifications/${activeProject}`}>Kravspesifikasjoner</Link>
                            <Link to={'newspecification'}>Ny kravspesifikasjon</Link>
                        </div>
                    </div>
                </div>

                <div className="active-project-title-container">
                    {activeProjectName}
                </div>
                
                <div className="navbar-button-container">
                    <div className="logout-dropdown">
                        <div className="dropdown">
                            <button className="dropbtn">{userName}&nbsp;&nbsp;<AccountIcon /> 
                                <i className="fa fa-caret-down"></i>
                            </button>
                            <div className="dropdown-content">
                                <Link to={''}>Brukerkonto</Link>
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