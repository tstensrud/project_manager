import axios from "axios";
import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { GlobalContext } from '../GlobalContext';
import {BASE_URL} from '../utils/globals.js'

function Logout(props) {

  const navigate = useNavigate();
  const {userUuid} = useContext(GlobalContext);
  
  useEffect(() => {
    function logMeOut() {
      axios({
        method: "POST",
        url:`${BASE_URL}/logout/${userUuid}/`,
      })
      .then((response) => {
         props.token()
         localStorage.removeItem("user_uuid");
         localStorage.removeItem("username");
         navigate('/');
      }).catch((error) => {
        if (error.response) {
          console.log(error.response)
          console.log(error.response.status)
          console.log(error.response.headers)
          }
      })}
      logMeOut();
  }, [props, navigate]);

    return(
      <>
      <h1>Du har logget ut</h1>
      </>
    )
}

export default Logout;