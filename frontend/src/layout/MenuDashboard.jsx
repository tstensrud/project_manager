import React, { useState } from "react";
import MenuItem from "./MenuItem";
import AccountIcon from '../assets/svg/accountIcon.svg?react';
import SpecificationsIcon from '../assets/svg/specificationsIcon.svg?react';
import NewProjectIcon from '../assets/svg/newProjectIcon.svg?react';
import DashboardIcon from '../assets/svg/dashboardIcon.svg?react';

function MenuDashboard() {
    const [active, setActive] = useState(false);
    const menuItems = [
        {id: 1, text: "Nytt prosjekt", svg: NewProjectIcon, url: "newproject"},
        {id: 2, text: "Dashboard", svg: DashboardIcon, url: "dashboard"},
        {id: 3, text: "Kravspesifikasjoner", svg: SpecificationsIcon, url: "specifications"},
        {id: 4, text: "Brukerkonto", svg: AccountIcon, url: "userprofile"},
        {id: 5, text: "Admin", url: "admin"},
        {id: 6, text: "Logg ut", url: "logout"}
    ];

    return (
        <>
        <div className="sidebar no-print">
            <ul className="sidebar-list">
                {menuItems.map(item => 
                <MenuItem 
                key={item.id} 
                item={item} 
                isActive={item.id === active} 
                onClick={() => setActive(item.id)}
                />)}
            </ul>
            <div className="sidebar-bottom">
                Structor TS &copy; 2024
            </div>
        </div>
        </>
    );
}

export default MenuDashboard;