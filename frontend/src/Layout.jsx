import { useContext } from "react";
import { Outlet } from 'react-router-dom';
import { GlobalContext } from './GlobalContext';
import Header from './layout/Header';



function Layout() {
    const { userUuid, setUserUuid } = useContext(GlobalContext);

    return(
        <>
        <Header />
        
        <div className="app-container">
            <Outlet />
        </div>
      </>
    );
}

export default Layout;