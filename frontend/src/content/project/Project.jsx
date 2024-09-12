import { useEffect, useState, useContext } from 'react';
import useFetch from '../../hooks/useFetch'
import { Link, useParams } from 'react-router-dom';
import { GlobalContext } from '../../GlobalContext';

// Components
import MainContentContainer from '../../layout/MainContentContainer.jsx'
import SubTitleComponent from '../../layout/SubTitleComponent';
import BuildingRoomData from './BuildingRoomData';
import HeaderIcon from '../../assets/svg/projectIcon.jsx';
import ProjectSummary from './ProjectSummary';
import VentilationSummary from './VentilationSummary';
import HeatingCoolingSummary from './HeatingCoolingSummary';


function Project() {
    const { projectId } = useParams();
    const { activeProject, userUuid, userName, setActiveProject, setActiveProjectName, token, setToken } = useContext(GlobalContext);
    const { data, loading, error } = useFetch(`/project_api/${projectId}/`)


    useEffect(() => {
        const projectName = data?.data?.ProjectName;
        setActiveProjectName(projectName);

        const activeProjectData = {
            projectName: data?.data?.ProjectName,
            projectId: data?.data?.uid
        }

        localStorage.setItem("projectData", JSON.stringify(activeProjectData))
    }, [data]);

    return (
        <>
            <SubTitleComponent svg={<HeaderIcon />} headerText={"Prosjektoversikt"} projectName={data && data.data.ProjectName} projectNumber={data && data.data.ProjectNumber} />
            <MainContentContainer>
                <div className="flex justify-center flex-row w-full flex-wrap">
                    <ProjectSummary projectId={projectId} />
                    <BuildingRoomData projectId={projectId} />
                    <VentilationSummary projectId={projectId} />
                    <HeatingCoolingSummary projectId={projectId} />
                </div>
            </MainContentContainer>
        </>
    );
}

export default Project;