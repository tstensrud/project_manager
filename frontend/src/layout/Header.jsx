import { useContext, useEffect } from "react";
import Navbar from './Navbar';
import { GlobalContext } from '../GlobalContext';

function Header() {
    const { userUuid, setUserUuid, username, setUserName } = useContext(GlobalContext);
    
    useEffect(() => {
        const storage_uuid = localStorage.getItem("user_uuid");
        const storage_username = localStorage.getItem("username")
        setUserUuid(storage_uuid);
        setUserName(storage_username);
    },[]);
    
return (
    <> 
        <Navbar></Navbar>
    </>
);
}

export default Header;