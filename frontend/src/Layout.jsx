import { Outlet } from 'react-router-dom';
import ToggleMode from './layout/ToggleMode';
import TodoButton from './layout/TodoButton';
import MenuProject from './layout/MenuProject';
import MenuDashboard from './layout/MenuDashboard';
import Header from './layout/Header';
import { useState } from 'react';

function Layout() {
    const [activeProject, setActiveProject] = useState();

    return(
        <>
        <ToggleMode/>

        {
            activeProject === undefined ?
            (
                <MenuDashboard />
            ) : (
                <MenuProject />
            )
        }
        
        <div className="app-content">
            <Header />
            <div className="text-div">
                <TodoButton/>
                <Outlet />
            </div>
        </div>
      </>
    );
}

export default Layout;