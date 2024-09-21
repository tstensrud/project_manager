import { useEffect } from "react";
import { Link } from "react-router-dom";

function NoAccess() {
    useEffect(() => {
        //localStorage.removeItem("token")
        sessionStorage.clear();
    }, [])

    return (
        <div className="flex w-full h-full text-dark-primary-color justify-center text-center items-center bg-gradient-to-tr from-dark-tertiary-color to-dark-secondary-color">
            <div className="flex flex-col overflow-auto justify-center items-center text-center bg-dark-secondary-color border border-dark-accent-color rounded-lg shadow-lg shadow-background-shade h-[40%]">
                <div className="flex flex-col items-center justify-center pl-20 pr-20 h-full text-base">
                    <div className="text-xl">
                        Structor TS prosjekter
                    </div>
                    <div>
                        Du er ikke innlogget.
                    </div>
                    <div>
                        <Link to="/">Logg inn her</Link>
                    </div>
                </div>
            </div>
        </div >
    );
}

export default NoAccess