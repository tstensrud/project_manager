import { useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';

// hooks and utils
import useFetch from '../../hooks/useFetch'
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
import MessageBox from '../../layout/MessageBox.jsx'

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
            <SubTitleComponent svg={<HeaderIcon />} headerText={"Prosjektoversikt"} projectName={data?.data?.ProjectName} projectNumber={data?.data?.ProjectNumber} />
            <MainContentContainer>
                {
                    loading ? (
                        <LoadingBar />
                    ) : (
                        <>
                            {
                                data?.success === true ? (
                                    <div className="flex justify-evenly flex-row w-full flex-wrap">
                                        <ProjectSummary projectData={data.data} projectId={projectId} />
                                        <BuildingRoomData data={data.data} projectId={projectId} />
                                        <VentilationSummary systemData={data.data.ventsystemData} totalAirflow={data.data.airflow} projectId={projectId} />
                                        <HeatingCoolingSummary totalCooling={data.data.cooling} totalHeating={data.data.heating} projectId={projectId} />
                                    </div>
                                ) : (
                                    <>
                                    {
                                        !loading && <MessageBox message={`${data?.message} - ${error}`} closeable={false} />
                                    }
                                    </>
                                )
                            }
                        </>
                    )
                }
            </MainContentContainer>

        </>
    );
}

export default Project;