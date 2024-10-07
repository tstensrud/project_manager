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
import TodoButton from '../TodoButton';

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
            <div className="w-full bg-tertiary-color justify-end pr-11 pl-11 dark:bg-dark-secondary-color text-primary-color dark:text-dark-primary-color flex pt-2 pb-2">
                <div className="flex h-full pr-3">
                    {
                        (activeProject && activeProject !== "0") && (
                            <TodoButton />
                        )
                    }
                </div>
                <div className="flex text-center items-center justify-center h-full dark:border-dark-default-border-color border-table-border-color">
                    <DarkmodeContainer />
                </div>
            </div>
        </>
    );
}

export default Navbar;