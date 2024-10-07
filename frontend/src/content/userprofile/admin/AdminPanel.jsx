import React, { useState } from 'react';

// Components
import UserList from './UserList.jsx';
import AdminIcon from '../../../assets/svg/adminIcon.jsx';
import AdminNavButton from './AdminNavButton.jsx';
import NewUser from './NewUser.jsx';
import ProjectList from './ProjectList.jsx';
import Statistics from './Statistics.jsx';

function AdminPanel() {

    const [newUserFlag, setNewUserFlag] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1)

    const menuItems = [
        { text: "Brukere", component: <UserList newUserFlag={newUserFlag} /> },
        { text: "Ny bruker", component: <NewUser newUserFlag={newUserFlag} setNewUserFlag={setNewUserFlag} /> },
        { text: "Prosjekter", component: <ProjectList /> },
        { text: "Statistikk", component: <Statistics /> }
    ];


    return (
        <div className="bg-secondary-color dark:bg-dark-tertiary-color rounded-lg w-full">
            <div className="flex flex-col h-full overflow-y-auto">
                <div className="flex flex-row mb-3 p-5">
                    <div>
                        <h2 className="text-grey-text dark:text-dark-grey-text">Admin-panel</h2>
                    </div>
                    <div className="flex flex-1 justify-end items-center">
                        <AdminIcon />
                    </div>
                </div>
                <div className="w-full border-b dark:border-dark-default-border-color border-default-border-color">
                    <div className="flex flex-row w-full mb-5 pl-5">
                        {
                            menuItems.map((item, index) => (
                                <div key={`navbutton-${index}`} className="mr-2">
                                    <AdminNavButton index={index} activeIndex={activeIndex} setActiveIndex={setActiveIndex} buttonText={item.text} />
                                </div>
                            ))
                        }
                    </div>
                </div>
                <div className="p-5">
                    {
                        menuItems.map((item, index) => (
                            index === activeIndex &&
                            <React.Fragment key={index}>
                                {item.component}
                            </React.Fragment>
                        ))
                    }
                </div>
            </div>
        </div>
    );
}

export default AdminPanel;