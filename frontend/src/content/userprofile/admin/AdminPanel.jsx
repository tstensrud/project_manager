import { useState } from 'react';

// Components
import UserList from './UserList.jsx';
import AdminIcon from '../../../assets/svg/adminIcon.jsx';
import AdminNavButton from './AdminNavButton.jsx';
import NewUser from './NewUser.jsx';
import ProjectList from './ProjectList.jsx';
import Statistics from './Statistics.jsx';

function AdminPanel() {

    const menuItems = [
        { text: "Brukere", component: <UserList /> },
        { text: "Ny bruker", component: <NewUser /> },
        { text: "Prosjekter", component: <ProjectList /> },
        {text: "Statistikk", component: <Statistics />}
    ];

    const [activeIndex, setActiveIndex] = useState(-1)

    return (
        <div className="bg-secondary-color dark:bg-dark-secondary-color rounded-lg shadow-lg w-full shadow-background-shade">
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
                    <div className="flex flex-row w-1/6 justify-evenly mb-5">
                        {
                            menuItems.map((item, index) => (
                                <AdminNavButton index={index} activeIndex={activeIndex} setActiveIndex={setActiveIndex} key={index} buttonText={item.text} />
                            ))
                        }
                    </div>
                </div>
                <div className="p-5">
                    {
                        menuItems.map((item, index) => (
                            index === activeIndex && item.component
                        ))
                    }
                </div>
            </div>
        </div>
    );
}

export default AdminPanel;