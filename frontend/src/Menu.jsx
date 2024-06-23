import React from "react";
import MenuItem from "./MenuItem";
import ProjectIcon from './assets/svg/projectIcon.svg?react';
import BuildingIcon from './assets/svg/buildingIcon.svg?react';
import RoomsIcon from './assets/svg/roomsIcon.svg?react';
import VentilationSystemIcon from './assets/svg/ventSystemIcon.svg?react';
import VentilationIcon from './assets/svg/ventilationIcon.svg?react';
import HeatingIcon from './assets/svg/heatingIcon.svg?react';
import CoolingIcon from './assets/svg/coolingIcon.svg?react';
import TapWaterIcon from './assets/svg/tapWaterIcon.svg?react';
import ProjectSettingsIcon from './assets/svg/projectSettingsIcon.svg?react';
import ReportsIcon from './assets/svg/reportsIcon.svg?react';
import DashboardIcon from './assets/svg/dashboardIcon.svg?react';
import AccountIcon from './assets/svg/accountIcon.svg?react';


function Menu() {
    
    const menuItems = [{id: 1, text: "Prosjektoversikt", svg: ProjectIcon, url: "Someurlasdf"},
        {id: 2, text:"Bygg", svg: BuildingIcon, url: "Someurl"},
        {id: 3, text: "Romliste", svg: RoomsIcon, url: "Someurl"},
        {id: 4, text: "Ventilasjonssytemer", svg: VentilationSystemIcon, url: "Someurl"},
        {id: 5, text: "Luftmengdetabell", svg: VentilationIcon, url: "Someurl"},
        {id: 6, text: "Varmeberegninger", svg: HeatingIcon, url: "Someurl"},
        {id: 7, text: "Kjøling", svg: CoolingIcon, url: "Someurl"},
        {id: 8, text: "Tappevann/SPV", svg: TapWaterIcon, url: "Someurl"},
        {id: 9, text: "Prosjektinnstillinger", svg: ProjectSettingsIcon, url: "Someurl"},
        {id: 10, text: "Rapporter", svg: ReportsIcon, url: "Someurl"},
        {id: 11, text: "Prosjekt dashboard", svg: DashboardIcon, url: "Someurl"},
        {id: 12, text: "Brukerkonto", svg: AccountIcon, url: "Someurl"},
        {id: 13, text: "Admin", url: "Someurl"},
        {id: 14, text: "Logg ut", url: "Someurl"}];

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

export default Menu;