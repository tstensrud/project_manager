import { useEffect } from "react";

function NoAccess() {
    useEffect(() => {
        localStorage.removeItem("token")
    }, [])

    return (
        <div className="w-[600px] p-5">
            <div>
                <p>Structor TS prosjekter</p>
                <p>Du må være logget inn for å se denne siden.
                    <br />
                    <a href="/">Logg inn her</a></p>
            </div>
        </div>
    );
}

export default NoAccess