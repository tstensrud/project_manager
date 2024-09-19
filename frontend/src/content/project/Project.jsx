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
import LoadingSpinner from '../../layout/LoadingSpinner.jsx';


function Project() {
    const { projectId } = useParams();
    const { setActiveProject, setActiveProjectName } = useContext(GlobalContext);
    const { data, loading, error } = useFetch(`/project_api/${projectId}/`);


    useEffect(() => {
        const projectName = data?.data?.ProjectName;
        setActiveProjectName(projectName);
        setActiveProject(projectId);

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
                {
                    loading ? (
                        <LoadingSpinner text="prosjekt" />
                    ) : (
                        <div className="flex justify-evenly flex-row w-full flex-wrap">
                            <ProjectSummary projectId={projectId} />
                            <BuildingRoomData projectId={projectId} />
                            <VentilationSummary projectId={projectId} />
                            <HeatingCoolingSummary projectId={projectId} />
                        </div>
                    )
                }
            </MainContentContainer>
        </>
    );
}

export default Project;