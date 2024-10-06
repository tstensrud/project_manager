import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { GlobalContext } from '../../context/GlobalContext';
import { signOut } from "firebase/auth";

// Hooks and utils
import useFetch from "../../hooks/useFetch";
import { AuthContext } from "../../context/AuthContext";

// Components
import DarkmodeContainer from "./DarkmodeContainer";
import NavPanel from "../NavPanel/NavPanel";

function Navbar() {
    const { currentUser, idToken, dispatch, loading: authLoading } = useContext(AuthContext);
    const { data: userData, loading, refetch: refetchUserInfo } = useFetch(currentUser ? `/user/${currentUser.uid}/` : null);

    const { activeProject, setActiveProject, userUuid, setUserUuid, setUserName, activeProjectName, setActiveProjectName } = useContext(GlobalContext);

    // useEffects
    useEffect(() => {
        refetchUserInfo();
        const projectData = JSON.parse(sessionStorage.getItem("projectData"));
        if (projectData) {
            const projectId = projectData.projectId;
            const projectName = projectData.projectName;
            setActiveProject(projectId);
            setActiveProjectName(projectName);
        }
    }, []);

    useEffect(() => {
        setUserUuid(userData?.data?.uuid);
        setUserName(userData?.data?.name);
    }, [userData]);

    return (
        <>
            <NavPanel />
            <div className="w-full bg-tertiary-color justify-between dark:bg-dark-tertiary-color text-primary-color dark:text-dark-primary-color flex min-h-10 max-h-10">
                <div className="flex pl-5 justify-start items-center h-gull text-base">
                </div>


                <div className="flex pr-5 justify-end text-end h-full text-base items-center">
                    <div className="flex text-center items-center justify-center pl-3 h-full dark:border-dark-default-border-color border-table-border-color">
                        <DarkmodeContainer />
                    </div>
                </div>
            </div>
        </>
    );
}

export default Navbar;