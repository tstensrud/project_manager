import { useContext, useEffect } from "react";
import Navbar from './Navbar';
import { GlobalContext } from '../GlobalContext';

function Header() {
return (
    <> 
        <Navbar></Navbar>
    </>
);
}

export default Header;