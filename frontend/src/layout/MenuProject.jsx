import React from "react";
import MenuItem from "./MenuItem";
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


function MenuProject() {
    
    const menuItems = [
        {id: 1, text: "Prosjektoversikt", svg: ProjectIcon, url: "project"},
        {id: 2, text:"Bygg", svg: BuildingIcon, url: "buildings"},
        {id: 3, text: "Romliste", svg: RoomsIcon, url: "rooms"},
        {id: 4, text: "Ventilasjonssytemer", svg: VentilationSystemIcon, url: "ventsystems"},
        {id: 5, text: "Luftmengdetabell", svg: VentilationIcon, url: "ventilation"},
        {id: 6, text: "Varmeberegninger", svg: HeatingIcon, url: "heating"},
        {id: 7, text: "Kjøling", svg: CoolingIcon, url: "cooling"},
        {id: 8, text: "Tappevann/SPV", svg: TapWaterIcon, url: ""},
        {id: 9, text: "Prosjektinnstillinger", svg: ProjectSettingsIcon, url: ""},
        {id: 10, text: "Rapporter", svg: ReportsIcon, url: ""},
        {id: 11, text: "Prosjekt dashboard", svg: DashboardIcon, url: "projects"},
        {id: 12, text: "Logg ut", url: "logout"}
    ];

    return (
        <>
        <div className="sidebar no-print">
            <ul className="sidebar-list">
                {menuItems.map(item => <MenuItem key={item.id} item={item}/>)}
            </ul>
            <div className="sidebar-bottom">
                Structor TS &copy; 2024
            </div>
        </div>
        </>
    );
}

export default MenuProject;