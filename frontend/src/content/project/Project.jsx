import { useEffect, useState, useContext } from 'react';
import useFetch from '../../hooks/useFetch'
import { Link, useParams } from 'react-router-dom';
import { GlobalContext } from '../../GlobalContext';

import SubTitleComponent from '../../layout/SubTitleComponent';
import BuildingRoomData from './BuildingRoomData';
import HeaderIcon from '../../assets/svg/projectIcon.svg?react';
import ProjectSummary from './ProjectSummary';
import VentilationSummary from './VentilationSummary';
import HeatingCoolingSummary from './HeatingCoolingSummary';


function Project () {
    const {projectId} = useParams();
    const { activeProject, userUuid, userName, setActiveProject, setActiveProjectName, token, setToken } = useContext(GlobalContext);
    const {data, loading, error} = useFetch(`/project_api/${projectId}/`)
    
    
    useEffect(() => {
        const projectName = data && data.data.ProjectName;
        setActiveProjectName(projectName);
        localStorage.setItem("projectname", projectName);
    },[data]);
    
    return (
        <>
            <SubTitleComponent>
              <HeaderIcon /> &nbsp; Prosjektoversikt - {data && data.data.ProjectNumber} {data && data.data.ProjectName}
            </SubTitleComponent>
            <div className="main-content">

                <div className="flex-container-row">
                    <ProjectSummary projectId={projectId} />
                    <BuildingRoomData projectId={projectId} />
                    <VentilationSummary projectId={projectId} />
                </div>

                <div className="flex-container-row">
                    <HeatingCoolingSummary projectId={projectId} />
                    
                </div>
            </div>
        </>
    );
}

export default Project;