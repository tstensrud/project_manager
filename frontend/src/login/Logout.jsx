import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Logout(props) {
//console.log(props);
  const navigate = useNavigate();

  useEffect(() => {
    function logMeOut() {
      axios({
        method: "POST",
        url:"http://127.0.0.1:5000/logout",
      })
      .then((response) => {
         props.token()
         console.log(response);
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