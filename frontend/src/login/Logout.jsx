import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";

import { AuthContext } from "../context/AuthContext";
import { auth } from "../utils/firebase";

function Logout() {

  const navigate = useNavigate();
  const { currentUser, idToken, dispatch, loading: authLoading } = useContext(AuthContext);

  useEffect(() => {
    handleLogOut();
  }, []);

  const handleLogOut = async () => {
    await signOut(auth).then(() => {
        dispatch({type: "LOGOUT" });
        navigate("/");
    }).catch((error) => {
        console.log(error);
    })
}
}

export default Logout;