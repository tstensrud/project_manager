import { useEffect, useContext } from 'react';
import useFetch from '../../hooks/useFetch'
import { useParams } from 'react-router-dom';
import { GlobalContext } from '../../context/GlobalContext';

// Components
import MainContentContainer from '../../layout/MainContentContainer.jsx'
import SubTitleComponent from '../../layout/SubTitleComponent';
import BuildingRoomData from './BuildingRoomData';
import HeaderIcon from '../../assets/svg/projectIcon.jsx';
import ProjectSummary from './ProjectSummary';
import VentilationSummary from './VentilationSummary';
import HeatingCoolingSummary from './HeatingCoolingSummary';
import LoadingBar from '../../layout/LoadingBar.jsx'


function Project() {
    const { projectId } = useParams();
    const { setActiveProject, setActiveProjectName } = useContext(GlobalContext);

    // Fetch requests
    const { data, loading, error } = useFetch(`/project_api/${projectId}/`);


    useEffect(() => {
        const projectName = data?.data?.ProjectName;
        setActiveProjectName(projectName);
        setActiveProject(projectId);

        const activeProjectData = {
            projectName: data?.data?.ProjectName,
            projectId: data?.data?.uid
        }

        sessionStorage.setItem("projectData", JSON.stringify(activeProjectData))
    }, [data]);

    return (
        <>
            <SubTitleComponent svg={<HeaderIcon />} headerText={"Prosjektoversikt"} projectName={data && data.data.ProjectName} projectNumber={data && data.data.ProjectNumber} />
            <MainContentContainer>
                {
                    loading ? (
                        <LoadingBar />
                    ) : (
                        <>
                            {
                                data?.success === true && (
                                    <div className="flex justify-evenly flex-row w-full flex-wrap">
                                        <ProjectSummary projectData={data.data} projectId={projectId} />
                                        <BuildingRoomData buildingData={data.data.buildingData} projectId={projectId} />
                                        <VentilationSummary systemData={data.data.ventsystemData} totalAirflow={data.data.airflow} projectId={projectId} />
                                        <HeatingCoolingSummary totalCooling={data.data.cooling} totalHeating={data.data.heating} projectId={projectId} />
                                    </div>

                                )
                            }
                        </>
                    )
                }
                <div class="group p-4">

                    <div class="bg-gray-200 p-4 rounded-md hover:bg-gray-400 cursor-pointer">
                        Hover over me
                    </div>


                    <div class="bg-yellow-300 p-4 mt-2 hidden group-hover:block">
                        I appear when you hover over the first div
                    </div>
                </div>

            </MainContentContainer>
        </>
    );
}

export default Project;