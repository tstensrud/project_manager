import { useEffect } from "react";

function NoAccess() {
    useEffect(() => {
        localStorage.removeItem("token")
    }, [])

    return (
        <div className="login-page">
            <div className="form">
                <p className="message">Structor TS prosjekter</p>
                <p className="message">Du må være logget inn for å se denne siden.
                    <br />
                    <a href="/">Logg inn her</a></p>
            </div>
        </div>
    );
}

export default NoAccess