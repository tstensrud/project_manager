import React, { useState } from "react";
import { useContext } from "react";
import { Link } from 'react-router-dom';
import { GlobalContext } from '../GlobalContext';
import ProjectIcon from '../assets/svg/projectIcon.svg?react';
import BuildingIcon from '../assets/svg/buildingIcon.svg?react';
import RoomsIcon from '../assets/svg/roomsIcon.svg?react';
import VentilationSystemIcon from '../assets/svg/ventSystemIcon.svg?react';
import VentilationIcon from '../assets/svg/ventilationIcon.svg?react';
import HeatingIcon from '../assets/svg/heatingIcon.svg?react';
import CoolingIcon from '../assets/svg/coolingIcon.svg?react';
import TapWaterIcon from '../assets/svg/tapWaterIcon.svg?react';
import ProjectSettingsIcon from '../assets/svg/projectSettingsIcon.svg?react';
import ReportsIcon from '../assets/svg/reportsIcon.svg?react';
import DashboardIcon from '../assets/svg/dashboardIcon.svg?react';



function Navbar() {
    const { activeProject, setActiveProject, activeProjectName, token, setToken } = useContext(GlobalContext);

    return (
        <>
        
        <div className="navbar">

            <div className="dropdown">
                <button className="dropbtn">Prosjekt
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
                    <Link to={''}>Nytt prosjekt</Link>
                    <Link to={''}>Kravspesifikasjoner</Link>
                </div>
            </div>

            <div className="active-project-title-container">
                {activeProjectName}
            </div>

            <div className="logout-dropdown">
                <div className="dropdown">
                    <button className="dropbtn">Brukerinnstillinger
                        <i className="fa fa-caret-down"></i>
                    </button>
                    <div className="dropdown-content">
                        <Link to={''}>Brukerkonto</Link>
                        <Link to={'logout'}>Logg ut</Link>
                    </div>
                </div>
            </div>

         </div> 
        </>
    );
}

export default Navbar;