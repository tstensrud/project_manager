import { useEffect } from "react";

function NoAccess() {
    useEffect(() => {
        localStorage.removeItem("token")
    },[])

    return (
        <>
        Du må være logget inn for å se denne siden.
        <br />
        <a href="/">Logg inn her</a>
        </>
    );
}

export default NoAccess