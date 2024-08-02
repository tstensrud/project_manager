import axios from "axios";
import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { GlobalContext } from '../GlobalContext';

function Logout(props) {

  const navigate = useNavigate();
  const {userUuid} = useContext(GlobalContext);
  
  useEffect(() => {
    function logMeOut() {
      axios({
        method: "POST",
        //url:`http://127.0.0.1:5000/logout/${userUuid}/`,
        url: `https://project-manager-rust.vercel.app/api/logout/${userUuid}/`,
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