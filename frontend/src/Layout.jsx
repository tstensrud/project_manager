import { Outlet } from 'react-router-dom';
import ToggleMode from './layout/ToggleMode';
import ToDo from './layout/Todo';
import Menu from './layout/Menu';
import Header from './layout/Header';

function Layout() {
    return(
        <>
        <ToggleMode/>
        <Menu />
        <div className="app-content">
            <Header />
            <div className="text-div">
                <ToDo/>
                <Outlet />
            </div>
        </div>
      </>
    );
}

export default Layout;