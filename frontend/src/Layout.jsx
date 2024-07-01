import { Outlet } from 'react-router-dom';
import ToggleMode from './layout/ToggleMode';
import TodoButton from './layout/TodoButton';
import Header from './layout/Header';

import Footer from './layout/Footer';


function Layout() {

    return(
        <>
        <Header />
        <TodoButton/>
        <div className="app-container">
            <div className="app-content">
                <div className="content-wrapper">
                    <Outlet />
                </div>
            </div>
        </div>
        <Footer></Footer>
      </>
    );
}

export default Layout;