import { useContext, useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom';

import { GlobalContext } from '../../GlobalContext';

// components
import SubTitleComponent from '../../layout/SubTitleComponent';
import useFetch from '../../hooks/useFetch'
import HeaderIcon from '../../assets/svg/dashboardIcon.jsx';
import LoadingSpinner from '../../layout/LoadingSpinner.jsx';
import ContentCard from '../../layout/ContentCard';
import MainContentContainer from '../../layout/MainContentContainer.jsx';
import CardSelect from '../../layout/formelements/CardSelect.jsx';
import CardButton from '../../layout/formelements/CardButton.jsx';

function Dashboard() {

  const { setActiveProject, setActiveProjectName } = useContext(GlobalContext);

  const [projectId, setProjectId] = useState('');
  const { data, loading, error } = useFetch('/projects/');
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    setActiveProject('0');
    setActiveProjectName('');
  }, []);

  const handleChange = (e) => {
    const projectId = e.target.value;
    setProjectId(projectId);
    setActiveProject(projectId);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (projectId === "") {
      inputRef.current.focus();
      return;
    }
    navigate(`/project/${projectId}`);
  }

  return (
    <>
      <SubTitleComponent svg={<HeaderIcon />} headerText={"Dashboard - velg prosjekt"} projectName={""} projectNumber={""} />
      <MainContentContainer>
        {
          loading && loading === true ? (
            <LoadingSpinner />
          ) : (
            <div className="flex justify-center flex-row w-full">


              <ContentCard>
                <h2>Velg prosjekt</h2>
                <form className="custom-form profile-form" onSubmit={handleSubmit}>
                  <p>Velg prosjekt å jobbe på fra menyen under, eller opprett nytt prosjekt fra menyen over: Dashboard - Nytt prosjekt</p>
                  <div className="mt-3">
                    <CardSelect ref={inputRef} changeFunction={handleChange}>
                      <option>- Velg prosjekt -</option>
                      {
                        Array.isArray(data?.data) && (
                          data.data.map((project) => (
                            <option key={project.ProjectName} value={project.uid}>
                              {project.ProjectNumber} {project.ProjectName}
                            </option>
                          ))
                        )
                      }
                    </CardSelect>
                  </div>
                  <div className="mt-3">
                    <CardButton buttonText="Gå til valgt prosjekt" />
                  </div>
                </form>

                {error && error.message}

              </ContentCard>
            </div>
          )
        }
      </MainContentContainer>
    </>
  );
}

export default Dashboard;